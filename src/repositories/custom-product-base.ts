import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { CustomProductBase } from "../models/custom-product-base";

export const CustomProductBaseRepository = dataSource.getRepository(CustomProductBase).extend({});
export default CustomProductBaseRepository;
