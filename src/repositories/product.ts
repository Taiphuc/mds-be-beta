import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Product } from '../models/product';
import {
  // alias the core repository to not cause a naming conflict
  ProductRepository as MedusaProductRepository,
} from '@medusajs/medusa/dist/repositories/product';

export const ProductRepository = dataSource.getRepository(Product).extend({
  // it is important to spread the existing repository here.
  //  Otherwise you will end up losing core properties
  ...MedusaProductRepository,
});

export default ProductRepository;
