import { Queue, Worker, Job } from 'bullmq';
import { TransactionBaseService, EventBusService, ProductService, Logger } from "@medusajs/medusa";
import { blue, blueBright, yellow, red, green } from "colorette";

const redisUrlParse = require('redis-url-parse');

class ProductsBaseQueueService extends TransactionBaseService {
    private eventBusService_: EventBusService;
    private readonly queue_: Queue;
    private productWorker_: Worker;
    private productService: ProductService;
    private logger_: Logger;
    private readonly redisURL_: string = process.env.REDIS_URL;
    constructor(container, options) {
        super(container);
        this.eventBusService_ = container.eventBusService;
        this.productService = container.productService;
        this.manager_ = container.manager;
        this.logger_ = container.logger;
        this.redisURL_ = options.redisURL || this.redisURL_;
        const redisConfig = redisUrlParse(this.redisURL_);
        this.queue_ = new Queue('printful-products-base', {
            connection: redisConfig,
        });
        this.queue_.obliterate().then(() => {
            console.log(`${blueBright("[printful-product-base]:")} Queue obliterated!`)
        })


        this.productWorker_ = new Worker("printful-products-base",
            async (job: Job) => {
                try {
                    this.logger_.info(`Processing job #${job.id}`);
                    console.info(`${blueBright("[printful-product-base]:")} Processing job #${job.id}`)
                    const { productId, productBaseVariants, printfulProductId } = job.data;

                    console.log(`${blue("[printful-product-base]:")} start create product base of printful product ${printfulProductId} `);
                    await container.printfulService.createCustomProductBase({ productId, productBaseVariants, printfulProductId });
                    console.log(`${green("[printful-product-base]:")} done create product base of printful product ${printfulProductId} `);

                    await this.queue_.clean(0, 10, 'completed')
                    return 1
                } catch (e) {
                    console.error(`${red("[printful-product-base]:")} Job failed with ID ${job.id}:`, e);
                    if (e.code === 429) {
                        const duration = parseInt(e.error.message.match(/try again after (\d+)/)[1]);
                        console.log(`${yellow("[printful-product-base]:")} Rate limit reached. Pausing queue for ${yellow(duration)} seconds.`);
                        await this.queue_.pause();
                        setTimeout(() => this.queue_.resume(), duration * 1000);
                    } else {
                        await this.queue_.pause();
                        setTimeout(() => this.queue_.resume(), 60000);
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
        console.log(`${blue("[printful-product-base]:")} Adding job to queue!`)
        await this.queue_.add("printful-product-base-event", productPayload, { removeOnComplete: true });
    }

    async addBulkJobs(jobsData) {
        console.log(`[printful-product-base]: Attempting to add jobs to the queue.`);
        await this.queue_.addBulk(jobsData);
        console.log(`[printful-product-base]: Successfully added ${jobsData.length} jobs to the queue.`);
    }



}

export default ProductsBaseQueueService;