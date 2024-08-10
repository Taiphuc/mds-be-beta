import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { ProductCollection } from '../models/collection';

export const ProductCollectionRepository = dataSource
  .getRepository(ProductCollection)
  .extend({});
export default ProductCollectionRepository;
