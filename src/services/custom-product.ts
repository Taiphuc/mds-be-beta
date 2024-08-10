import {
  TransactionBaseService,
} from "@medusajs/medusa";
import CustomProductRepository from "../repositories/custom-product";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { GetCustomProductsBaseDto, RetrieveCustomProductBaseDto } from "../types/dto/customProductBaseDto";

class CustomProductService extends TransactionBaseService {
  protected customProductRepository: typeof CustomProductRepository;

  constructor(container) {
    super(arguments[0]);
    this.customProductRepository = container.manager.withRepository(container.customProductRepository)
  }

  async list(payload: GetCustomProductsBaseDto | any){
    const { page, limit, skip } = calculatorQueryParams(payload);
    const res = await this.customProductRepository.findAndCount({
      take: limit,
      skip,
      relations: { product: true },
      order: { created_at: 'DESC' }
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);
    return { data, count, total, page, pageCount };
  }

  async retrieve(payload: RetrieveCustomProductBaseDto | any){
    const res = await this.customProductRepository.findOne({
      where: {
        productId: payload?.productId
      },
    });
    return res
  }

  async add(payload){
    const data = this.customProductRepository.create(payload)
    return await this.customProductRepository.save(data);
  }

  async deleteOne(payload: any){
    const res = await this.customProductRepository.delete({ id: payload?.productId });
    return res
  }
}

export default CustomProductService;
