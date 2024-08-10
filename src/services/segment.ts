import { CustomerService, Logger, TransactionBaseService } from '@medusajs/medusa';
import { Segment } from '../models/segment';
import SegmentRepository from '../repositories/segment';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import ProductService from './product';
import { ProductStatus, Selector } from '@medusajs/types';
import CustomerGroupRepository from '@medusajs/medusa/dist/repositories/customer-group';
import { CUSTOMER_GROUP } from '../utils/const/customerGroup';
import { Customer } from '../models/customer';
import { MAIL_TEMPLATES_AND_TYPES } from '../utils/const/mail';
import SendMailQueueService from './sendMailQueue';

type InjectedDependencies = {
  manager: EntityManager;
  segmentRepository: typeof SegmentRepository;
  customerGroupRepository: typeof CustomerGroupRepository;
  productService: ProductService;
  customerService: CustomerService;
  sendMailQueueService: SendMailQueueService;
  logger: Logger;
};

class SegmentService extends TransactionBaseService {
  protected segmentRepository_: typeof SegmentRepository;
  protected customerGroupRepository: typeof CustomerGroupRepository;
  protected productService: ProductService;
  protected customerService: CustomerService;
  protected sendMailQueueService: SendMailQueueService;
  protected logger: Logger;

  constructor({ segmentRepository, productService, customerGroupRepository, customerService, sendMailQueueService, logger }: InjectedDependencies) {
    super(arguments[0]);
    this.segmentRepository_ = segmentRepository;
    this.productService = productService;
    this.customerGroupRepository = customerGroupRepository
    this.customerService = customerService
    this.sendMailQueueService = sendMailQueueService
    this.logger = logger
  }

  async create(data): Promise<boolean> {
    const segmentRepo = this.activeManager_.withRepository(
      this.segmentRepository_
    );
    if (
      !data.condition ||
      !data.timeValue ||
      !data.timeType ||
      !data.mailSubject ||
      !data.templateNormalId
    )
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Data invalid');

    if (!data.templateVipId) delete data.templateVipId;
    await segmentRepo.save(segmentRepo.create(data));
    return true;
  }

  list(query): Promise<Pagination<Segment>> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const segmentRepo = this.activeManager_.withRepository(
      this.segmentRepository_
    );
    return paginate<Segment>(segmentRepo, { page, limit });
  }

  async update(id: string, data): Promise<boolean> {
    const segmentRepo = this.activeManager_.withRepository(
      this.segmentRepository_
    );

    const result = await segmentRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Mail template not found'
      );

    delete data.updatedAt;
    delete data.deletedAt;

    await segmentRepo.save({ ...result, ...data });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const segmentRepo = this.activeManager_.withRepository(
      this.segmentRepository_
    );
    await segmentRepo.softDelete(id);
    return true;
  }

  async sendMailSubscribeNewProduct(productId: string){
    const segmentRepo = this.activeManager_.withRepository(
      this.segmentRepository_
    );
    const segment = await segmentRepo.findOne({ where: { condition: 'subscribe_new_product', isActive: true } });
    if( !segment){
      this.logger.warn('segment not found or not active');

      return
    }
    const addToJob = async (customers: any, product: any) => {
      const jobs = customers?.map(customer => {
        return {
            type: MAIL_TEMPLATES_AND_TYPES.subscribe_new_product_mail,
            mailTo: customer.email,
            product: product
        }
      })
      await this.sendMailQueueService.addBulkJobs(jobs)
    }

    try {
      const product = await this.productService.retrieve(productId,{relations:['variants', 'variants.prices']});
      if (product.status === ProductStatus.PUBLISHED) {
        const customerGroup = await this.customerGroupRepository.findOne({ where: { name: CUSTOMER_GROUP.subscribeNewProduct } });
        if (!customerGroup) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, 'CustomerGroup subscribe new product not found')
        }
        const filter = {
          groups: [customerGroup.id]
        } as Selector<Customer> & { q?: string, groups: string[] }
        const [customers, count] = await this.customerService.listAndCount(filter, {
          take: 100,
          skip: 0,
          order: {
            created_at: 'ASC',
          },
        })
        await addToJob(customers, product)
        if (count > 100) {
          for (let i = 100; i < count; i += 100) {
            const customers = await this.customerService.list(filter, {
              take: 100,
              skip: i,
              order: {
                created_at: 'ASC',
              },
            })
            await addToJob(customers, product)
          }
        }
      }
    } catch (error) {
      console.log("🚀 => error:", error)
    }
  }
}

export default SegmentService;
