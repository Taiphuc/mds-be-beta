import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { ProductTag } from '../models/tag';

export const ProductTagRepository = dataSource
  .getRepository(ProductTag)
  .extend({});
export default ProductTagRepository;
