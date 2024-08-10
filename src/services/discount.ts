import { CustomerService, DiscountService as MedusaDiscountService } from "@medusajs/medusa";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { GetCustomerAdminDiscountsDto } from "../types/dto/discountDto";
import SESService from "./ses";
import MailTemplateRepository from "../repositories/mail-template";
import Handlebars from "handlebars";
import { format, parseISO } from "date-fns";
import { MAIL_TEMPLATES_AND_TYPES } from "../utils/const/mail";

class DiscountService extends MedusaDiscountService {
  protected customerService_: CustomerService;
  protected sesService_: SESService;
  protected templateRepo_: typeof MailTemplateRepository;
  constructor(container) {
    super(container);
    this.customerService_ = container.customerService
    this.templateRepo_ = container.manager.withRepository(container.mailTemplateRepository)
    try {
      this.sesService_ = container.sesService
    } catch (error) {

    }
  }

  async getCustomerAdminDiscounts(payload: GetCustomerAdminDiscountsDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);
    let filter = {};
    if (payload?.status === 'active') {
      filter = { is_disabled: false }
    }
    if (payload?.status === 'disabled') {
      filter = { is_disabled: true }
    }
    const res = await this.discountRepository_.findAndCount({
      where: {
        metadata: {
          customer_id: payload?.customer_id,
          type: "admin_coupon",
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

  async sendDiscountForCustomer(discountId: string) {
    const discount = await this.discountRepository_.findOne({ where: { id: discountId }, relations: { rule: true } });
    if (discount.metadata?.customer_id) {
      const customer = await this.customerService_.retrieve(discount.metadata.customer_id as string, { select: ['email'] });
      const mailTemplate = await this.templateRepo_.findOne({ where: { title: MAIL_TEMPLATES_AND_TYPES.discount_mail } });
      const template = Handlebars.compile(mailTemplate.data);
      const html = template({ discount_code: discount.code, discount_expiry_date: format(discount.ends_at, 'yyyy-MM-dd HH:mm') })
      await this.sesService_.sendEmailWithoutTemplate({
        from: process.env.SES_FROM,
        to: customer.email,
        subject: `No reply`,
        html,
        text: "",
      });
    }
    return true
  }
}

export default DiscountService;
