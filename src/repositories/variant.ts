import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { ProductVariant } from "../models/variant";

export const ProductVariantRepository = dataSource.getRepository(ProductVariant).extend({});
export default ProductVariantRepository;
