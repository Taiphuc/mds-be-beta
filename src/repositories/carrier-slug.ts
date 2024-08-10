import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { CarrierSlug } from "../models/carrier-slug";

export const CarrierSlugRepository = dataSource.getRepository(CarrierSlug).extend({});
export default CarrierSlugRepository;
