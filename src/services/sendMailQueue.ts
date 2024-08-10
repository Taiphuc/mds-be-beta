import { Queue, Worker, Job } from 'bullmq';
import { TransactionBaseService, EventBusService, ProductService, Logger } from "@medusajs/medusa";
import { blue, blueBright, yellow, red } from "colorette";
import SESService from './ses';
import MailTemplateRepository from '../repositories/mail-template';
import Handlebars from "handlebars";
import { MAIL_TEMPLATES_AND_TYPES } from '../utils/const/mail';

const redisUrlParse = require('redis-url-parse');

class SendMailQueueService extends TransactionBaseService {
    private eventBusService_: EventBusService;
    private printfulService_: any;
    private readonly queue_: Queue;
    private mailWorker_: Worker;
    protected templateRepo_: typeof MailTemplateRepository;
    private sesService: SESService;
    private logger_: Logger;
    private readonly redisURL_: string = process.env.REDIS_URL;
    constructor(container, options) {
        super(container);
        this.eventBusService_ = container.eventBusService;
        this.sesService = container.sesService;
        this.manager_ = container.manager;
        this.templateRepo_ = container.manager.withRepository(container.mailTemplateRepository)
        this.logger_ = container.logger;
        this.redisURL_ = options.redisURL || this.redisURL_;
        const redisConfig = redisUrlParse(this.redisURL_);
        this.queue_ = new Queue('send-mail-worker', {
            connection: redisConfig,
        });
        this.queue_.obliterate().then(() => {
            console.log(`${blueBright("[send-mail-queue]:")} Queue obliterated!`)
        })


        this.mailWorker_ = new Worker("send-mail-worker",
            async (job: Job) => {
                const { type } = job.data
                if (type === MAIL_TEMPLATES_AND_TYPES.subscribe_new_product_mail) {
                    await this.sendSubscribeNewProductMail(job);
                }
                await this.queue_.clean(0, 100, 'completed')
                return 1
            },
            {
                connection: redisConfig,
                concurrency: 1,
                limiter: { max: 300, duration: 1000 },

            });
    }

    async addJob(mailPayload) {
        console.log(`${blue("[send-mail-queue]:")} Adding job to queue!`)
        await this.queue_.add("send Mail Job", mailPayload, { removeOnComplete: true });
    }

    async addBulkJobs(jobsData) {
        console.log(`[send-mail-queue]: Attempting to add jobs to the queue.`);
        await this.queue_.addBulk(jobsData);
        console.log(`[send-mail-queue]: Successfully added ${jobsData.length} jobs to the queue.`);
    }

    async sendSubscribeNewProductMail(job: any) {
        try {
            this.logger_.info(`Processing job #${job.id}`);
            console.info(`${blueBright("[send-mail-service]:")} Processing job #${job.id} - [${job.data.mailTo}]`)
            const { mailTo, product } = job.data
            const product_link = process.env.STORE_URL + '/products/' + product.handle
            const mailTemplate = await this.templateRepo_.findOne({ where: { title: MAIL_TEMPLATES_AND_TYPES.subscribe_new_product_mail } });
            if (!mailTemplate) {
                console.error(red("mail template not found! please create template with name subscribe_new_product_mail!"))
                return
            }
            const template = Handlebars.compile(mailTemplate.data);
            const html = template({ product_name: product.name, product_thumbnail: product.thumbnail, product_description: product.description, product_amount: product?.variants?.[0]?.prices?.[0]?.amount, product_link })

            await this.sesService.sendEmailWithoutTemplate({
                from: process.env.SES_FROM,
                to: mailTo,
                subject: `No reply`,
                html,
                text: "",
            });
        } catch (e) {
            console.error(`Job failed with ID ${job.id}: ${e}`, e);
            if (e.code === 429) {
                const duration = parseInt(e.error.message.match(/try again after (\d+)/)[1]);
                console.log(`${yellow("[send-mail-queue]:")} Rate limit reached. Pausing queue for ${yellow(duration)} seconds.`);
                await this.queue_.pause();
                setTimeout(() => this.queue_.resume(), duration * 1000);
            } else {
                throw e.result
            }
        }
    }

}

export default SendMailQueueService;