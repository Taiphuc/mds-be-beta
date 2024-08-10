import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { SizeGuide } from '../models/size-guide';

export const SizeGuideRepository = dataSource
  .getRepository(SizeGuide)
  .extend({});
export default SizeGuideRepository;
