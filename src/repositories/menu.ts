import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Menu } from "../models/menu";

export const MenuRepository = dataSource.getRepository(Menu).extend({});
export default MenuRepository;
