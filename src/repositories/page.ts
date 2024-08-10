import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Page } from "../models/page";

export const PageRepository = dataSource.getRepository(Page).extend({});
export default PageRepository;
