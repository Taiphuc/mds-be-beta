import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductReview } from "../models/product-review";

export const ProductReviewRepository = dataSource.getRepository(ProductReview).extend({});
export default ProductReviewRepository;
