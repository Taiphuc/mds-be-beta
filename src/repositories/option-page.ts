import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { OptionPage } from "../models/option-page";

export const OptionPageRepository = dataSource.getRepository(OptionPage).extend({});
export default OptionPageRepository;
