import {
  TransactionBaseService,
} from "@medusajs/medusa";
import CustomProductBaseRepository from "../repositories/custom-product-base";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { DeleteCustomProductBaseDto, GetCustomProductsBaseDto, RetrieveCustomProductBaseDto } from "../types/dto/customProductBaseDto";

class CustomProductBaseService extends TransactionBaseService {
  protected customProductBaseRepository: typeof CustomProductBaseRepository;

  constructor(container) {
    super(arguments[0]);
    this.customProductBaseRepository = container.manager.withRepository(container.customProductBaseRepository)
  }

  async list(payload: GetCustomProductsBaseDto | any){
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.customProductBaseRepository.findAndCount({
      take: limit,
      skip,
      relations: { product: true },
      order: { created_at: 'DESC' }
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }

  async retrieve(payload: RetrieveCustomProductBaseDto | any){
    const res = await this.customProductBaseRepository.findOne({
      where: {
        productId: payload?.productId
      },
    });
    return res
  }

  async create(payload: any){
    const res = await this.customProductBaseRepository.save(payload);
    return res
  }

  async deleteOne(payload: DeleteCustomProductBaseDto | any){
    const res = await this.customProductBaseRepository.delete({ id: payload?.productId });
    return res
  }

}

export default CustomProductBaseService;
