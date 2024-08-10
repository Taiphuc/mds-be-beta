import { EventBusService, Logger, TransactionBaseService } from "@medusajs/medusa";
import { Job, Queue, Worker } from 'bullmq';
import FileCustomService from './file-custom';

const redisUrlParse = require('redis-url-parse');

class GetImageQueueService extends TransactionBaseService {
    private eventBusService_: EventBusService;
    private readonly queue_: Queue;
    private worker_: Worker;
    private fileCustomService: FileCustomService;
    private logger_: Logger;
    private readonly redisURL_: string = process.env.REDIS_URL;
    constructor(container, options) {
        super(container);
        this.eventBusService_ = container.eventBusService;
        this.fileCustomService = container.fileCustomService;
        this.manager_ = container.manager;
        this.logger_ = container.logger;
        this.redisURL_ = options.redisURL || this.redisURL_;
        const redisConfig = redisUrlParse(this.redisURL_);
        this.queue_ = new Queue('get-image-queue', {
            connection: redisConfig,
        });
        this.queue_.obliterate().then(() => {
        })


        this.worker_ = new Worker("get-image-queue",
            async (job: Job) => {
                try {
                    this.logger_.info(`[get-image-queue] Processing job #${job.id}`);
                    await this.fileCustomService.getImageFromUrl(job?.data?.url);
                    await this.queue_.clean(0, 100, 'completed')
                    return 1
                } catch (error) {

                    const duration = parseInt(error.error.message.match(/try again after (\d+)/)[1]);

                    await this.queue_.pause();
                    setTimeout(() => this.queue_.resume(), duration * 1000);
                }
            },
            {
                connection: redisConfig,
                concurrency: 1,
                limiter: { max: 300, duration: 50 },
            });
    }

    async addJob(job) {
        await this.queue_.add("get-image-queue", job, { removeOnComplete: true });
    }

    async addBulkJobs(jobsData) {

        await this.queue_.addBulk(jobsData);

    }



}

export default GetImageQueueService;