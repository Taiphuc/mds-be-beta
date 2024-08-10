import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Point } from "../models/point";

export const PointRepository = dataSource.getRepository(Point).extend({});
export default PointRepository;
