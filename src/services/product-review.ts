import { ProductCategory, TransactionBaseService } from "@medusajs/medusa";
import { ProductReview } from "../models/product-review";
import ProductReviewRepository from "../repositories/product-review";
import { CreateReviewDto, UpdateReviewsActiveDto } from "../types/dto/createReviewDto";
import {
  CopyCategoryReviewsToProductDto,
  GetAllReviewsDto,
  GetReviewsOfCategoryDto,
  GetReviewsOfProductDto,
} from "../types/dto/getReviewsOfProductDto";
import { calculatorPagination, calculatorQueryParams } from "../types/pagination";
import { EntityManager, FindOptionsWhere, In, Like } from "typeorm";
import { toBoolean } from "../utils/boolean";
import ProductRepository from "@medusajs/medusa/dist/repositories/product";

type InjectedDependencies = {
  manager: EntityManager;
  productReviewRepository: typeof ProductReviewRepository;
  productRepository: typeof ProductRepository;
};

class ProductReviewService extends TransactionBaseService {
  protected productReviewRepository_: typeof ProductReviewRepository;
  protected productRepository_: typeof ProductRepository;

  constructor({ productReviewRepository, productRepository, manager }: InjectedDependencies) {
    super(arguments[0]);
    this.productReviewRepository_ = manager.withRepository(productReviewRepository);
    this.productRepository_ = manager.withRepository(productRepository);
  }

  async getProductReviews(payload: GetReviewsOfProductDto | any) {
    return await this.getReviews(payload, { product_id: payload?.product_id });
  }

  async copyCategoryReviewsToProduct(payload: CopyCategoryReviewsToProductDto | any) {
    const reviews = await this.getCategoryReviews({ ...payload, active: true });
    let totalRating = 0;
    const newReviews = reviews?.data?.map((review) => {
      totalRating += +review.rating;
      return this.productReviewRepository_.create({
        product_id: payload?.product_id,
        title: review.title,
        user_name: review.user_name,
        rating: review.rating,
        content: review.content,
        active: review.active,
      });
    });
    const productRating = reviews?.data?.length ? totalRating / reviews?.data?.length : 0;
    await this.productRepository_.save({ id: payload?.product_id, rating: productRating });
    await this.productReviewRepository_.save(newReviews);
    return {
      success: true,
    };
  }

  async getCategoryReviews(payload: GetReviewsOfCategoryDto | any) {
    const productCategoryRepository = this.activeManager_.getRepository(ProductCategory);
    const productCategory = await productCategoryRepository.findOne({
      where: {
        id: payload?.category_id || "",
      },
      relations: { products: true },
      select: { products: { id: true } },
    });
    const productIds = productCategory?.products?.map((p) => p.id);
    return await this.getReviews(payload, { product_id: In(productIds) });
  }

  async getReviews(payload: GetAllReviewsDto | any, filter: FindOptionsWhere<ProductReview> = {}) {
    const { page, limit, skip } = calculatorQueryParams(payload);

    if (payload?.rate) {
      filter.rating = payload.rate;
    }
    if (payload?.active !== undefined) {
      filter.active = toBoolean(payload.active);
    }
    const filters: FindOptionsWhere<ProductReview>[] = [];
    if (payload?.keyword) {
      filters.push({ ...filter, content: Like(`%${payload.keyword}%`) });
      filters.push({ ...filter, title: Like(`%${payload.keyword}%`) });
    }
    const res = await this.productReviewRepository_.findAndCount({
      where: filters?.length ? filters : filter,
      order: { created_at: "DESC" },
      relations: ["product"],
      select: {
        id: true,
        active: true,
        content: true,
        created_at: true,
        product: { id: true, title: true },
        product_id: true,
        rating: true,
        title: true,
        updated_at: true,
        user_name: true,
      },
      take: limit,
      skip,
    });
    const { count, data, pageCount, total } = calculatorPagination(res, limit);

    return { data, count, total, page, pageCount };
  }

  async addProductReview(data: CreateReviewDto) {
    if (!data.title || !data.user_name || !data.content || !data.product_id) {
      throw new Error("product review requires title, user_name, content, product_id, and rating");
    }
    data.rating = Number(data.rating) || 0;
    const product = await this.productRepository_?.findOne({ where: { id: data?.product_id } });
    if (product?.rating === 0) {
      product.rating = data.rating;
    } else {
      product.rating = data.rating ? (product.rating + data.rating) / 2 : product.rating;
    }
    await this.productRepository_.save(product);
    const createdReview = this.productReviewRepository_.create({
      product_id: data?.product_id,
      title: data?.title,
      user_name: data?.user_name,
      content: data?.content,
      rating: data?.rating,
    });
    const productReview = await this.productReviewRepository_.save(createdReview);

    return productReview;
  }

  async updateReviewsActive(data: UpdateReviewsActiveDto[]) {
    data = data?.map((d) => ({ id: d.id, active: !!d.active }));
    const productReview = await this.productReviewRepository_.save(data);
    return productReview;
  }

  async deleteReviews(ids: string[]) {
    await this.productReviewRepository_.delete({ id: In(ids) });
    return true;
  }
}

export default ProductReviewService;
