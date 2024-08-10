import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { ProductShippingProfile } from '../models/product-shipping-profile';

export const ProductShippingProfileRepository = dataSource
  .getRepository(ProductShippingProfile)
  .extend({});
export default ProductShippingProfileRepository;
