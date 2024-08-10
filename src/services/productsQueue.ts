import { Queue, Worker, Job } from 'bullmq';
import { TransactionBaseService, EventBusService, ProductService, Logger } from "@medusajs/medusa";
import { blue, blueBright, yellow, red } from "colorette";

const redisUrlParse = require('redis-url-parse');

class ProductsQueueService extends TransactionBaseService {
    private eventBusService_: EventBusService;
    private printfulService_: any;
    private readonly queue_: Queue;
    private productWorker_: Worker;
    private productService: ProductService;
    private logger_: Logger;
    private readonly redisURL_: string = process.env.REDIS_URL;
    constructor(container, options) {
        super(container);
        this.printfulService_ = container.printfulService;
        this.eventBusService_ = container.eventBusService;
        this.productService = container.productService;
        this.manager_ = container.manager;
        this.logger_ = container.logger;
        this.redisURL_ = options.redisURL || this.redisURL_;
        const redisConfig = redisUrlParse(this.redisURL_);
        this.queue_ = new Queue('printful-products', {
            connection: redisConfig,
        });
        this.queue_.obliterate().then(() => {
            console.log(`${blueBright("[printful-service]:")} Queue obliterated!`)
        })


        this.productWorker_ = new Worker("printful-products",
            async (job: Job) => {
                try {
                    this.logger_.info(`Processing job #${job.id}`);
                    console.info(`${blueBright("[printful-service]:")} Processing job #${job.id} - [${job.data.id}] ${blueBright(job.data.name)}`)
                    const { id } = job.data;

                    const { sync_product, sync_variants } = await this.printfulService_.getSyncProduct(id);
                    const products = await this.productService.list({ external_id: id });

                    if (products.length === 1) {
                        console.log(`${blue("[printful-service]:")} Updating product with external ID ${id}`)
                        const existingProduct = await this.productService.retrieve(products[0].id, { relations: ["variants", "options"] });
                        console.log(`${blue("[printful-service]:")} Retrieved product with ID ${existingProduct.id} from Medusa, trying to update it`)
                        await this.printfulService_.updateMedusaProduct({
                            sync_product,
                            sync_variants,
                            medusa_product: existingProduct
                        }, "fromPrintful", null)
                    } else if (products.length === 0) {
                        console.log(`${blue("[printful-service]:")} Create product ... ${job.id}`)
                        await this.printfulService_.createMedusaProduct({ sync_product, sync_variants })
                    }
                    await this.queue_.clean(0, 100, 'completed')
                    return 1
                } catch (e) {
                    console.error(`${red("[printful-service]:")} Job failed with ID ${job.id}:`, e);
                    if (e.code === 429) {
                        const duration = parseInt(e.error.message.match(/try again after (\d+)/)[1]);
                        console.log(`${yellow("[printful-service]:")} Rate limit reached. Pausing queue for ${yellow(duration)} seconds.`);
                        await this.queue_.pause();
                        setTimeout(() => this.queue_.resume(), duration * 1000);
                    } else {
                        throw e.result
                    }
                }
            },
            {
                connection: redisConfig,
                concurrency: 1,
                limiter: { max: 300, duration: 50 },

            });
    }

    async addJob(productPayload) {
        console.log(`${blue("[printful-service]:")} Adding job to queue!`)
        await this.queue_.add("printful-product-webhook-event", productPayload, { removeOnComplete: true });
    }

    async addBulkJobs(jobsData) {
        console.log(`[printful-service]: Attempting to add jobs to the queue.`);
        await this.queue_.addBulk(jobsData);
        console.log(`[printful-service]: Successfully added ${jobsData.length} jobs to the queue.`);
    }



}

export default ProductsQueueService;