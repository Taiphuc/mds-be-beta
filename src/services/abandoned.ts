import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import { GetAllAbandonedDto } from "src/types/dto/getReviewsOfProductDto";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";

class AbandonedService {
  private cartRepo_: typeof CartRepository;
  constructor(container) {
    this.cartRepo_ = container.cartRepository;
  }

  async getAbandoned(payload: GetAllAbandonedDto | any) {
    const { page, limit, skip } = calculatorQueryParams(payload);

    const res = await this.cartRepo_
      .createQueryBuilder("cart")
      .select()
      .where("cart.payment_id IS NULL")
      .andWhere("cart.email IS NOT NULL")
      .andWhere("EXISTS (SELECT * FROM line_item l WHERE l.cart_id = cart.id)")
      .take(limit)
      .skip(skip)
      .getManyAndCount();
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }
}

export default AbandonedService;
