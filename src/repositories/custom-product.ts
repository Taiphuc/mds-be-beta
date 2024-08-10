import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { CustomProduct } from '../models/custom-product';
export const CustomProductRepository = dataSource.getRepository(CustomProduct).extend({});
export default CustomProductRepository;
