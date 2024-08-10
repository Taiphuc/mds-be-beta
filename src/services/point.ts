import randomize from "randomatic"
import PointRepository from "../repositories/point";
import CustomerRepository from "../repositories/customer";
import { AllocationType, DiscountRuleType, DiscountService, TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { CreatePointDiscountDto, GetPointDiscountsDto, GetPointsDto } from "../types/dto/getPointsDto";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { MedusaError } from "medusa-core-utils";
import { POINT_TYPE } from "../utils/const/point";
import DiscountRepository from "@medusajs/medusa/dist/repositories/discount";

type InjectedDependencies = {
  manager: EntityManager;
  pointRepository: typeof PointRepository;
  customerRepository: typeof CustomerRepository;
  discountRepository: typeof DiscountRepository;
  discountService: DiscountService
};

class PointService extends TransactionBaseService {
  protected pointRepository_: typeof PointRepository;
  protected customerRepository_: typeof CustomerRepository;
  protected discountRepository_: typeof DiscountRepository;
  protected discountService_: DiscountService

  constructor({ pointRepository, customerRepository, discountService, discountRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.pointRepository_ = pointRepository;
    this.customerRepository_ = customerRepository;
    this.discountService_ = discountService;
    this.discountRepository_ = discountRepository;
  }

  async create(payload: { customerId: string, point: number, message?: string, metadata?: any, type: string, purchased: number }) {
    const customer = await this.customerRepository_.findOne({ where: { id: payload?.customerId } });
    await this.customerRepository_.save({
      ...customer,
      point: customer?.point ? +customer?.point + payload?.point : payload?.point,
      totalPurchased: customer?.totalPurchased ? +customer?.totalPurchased + payload?.purchased : payload?.purchased,
    });
    delete payload?.purchased;
    return await this.pointRepository_.save(payload);
  }

  async getMany(payload: GetPointsDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.pointRepository_.findAndCount({
      where: { customerId: payload?.customer_id },
      order: { created_at: "DESC" },
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);

    return { data, count, total, page, pageCount };
  }

  async createDiscount(payload: CreatePointDiscountDto | any) {
    if (!Number(payload?.point)) {
      throw new Error('Point must be greater than 0 ')
    }
    const customer = await this.customerRepository_.findOne({ where: { id: payload?.customer_id } })
    if (customer.point < payload?.point && payload?.point > 0) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "The number of points you want to add is more than the current number of points")
    }
    const code = randomize("A0", 10)
    await this.discountService_.create({
      code: 'cPoint_' + code,
      is_disabled: false,
      is_dynamic: false,
      rule: {
        type: DiscountRuleType.FIXED,
        value: payload?.point,
        description: "Discount of the customer points",
        allocation: AllocationType.TOTAL,
      },
      usage_limit: 1,
      regions: [payload?.region],
      metadata: {
        customer_id: payload?.customer_id,
        type: "point_discount",
      }
    })
    await this.create({ customerId: customer.id, point: -payload.point, purchased: 0, type: POINT_TYPE.create_discount, message: "Create a discount from point" })
    return true
  }

  async getPointDiscounts(payload: GetPointDiscountsDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    let filter = {};
    if (payload?.status === 'active') {
      filter = { is_disabled: false }
    }
    if (payload?.status === 'disabled') {
      filter = { is_disabled: true }
    }
    if (payload?.status === 'expired') {
      filter = {
        usage_count: 1
      }
    }
    const res = await this.discountRepository_.findAndCount({
      where: {
        metadata: {
          customer_id: payload?.customer_id,
          type: "point_discount",
        },
        ...filter,
      },
      order: { created_at: "DESC" },
      relations: {
        rule: true,
        regions: true
      },
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);

    return { data, count, total, page, pageCount };
  }
}

export default PointService;
