import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Address } from '../models/address';
import {
  // alias the core repository to not cause a naming conflict
  AddressRepository as MedusaAddressRepository,
} from '@medusajs/medusa/dist/repositories/address';

export const AddressRepository = dataSource.getRepository(Address).extend({
  // it is important to spread the existing repository here.
  //  Otherwise you will end up losing core properties
  ...MedusaAddressRepository,
});

export default AddressRepository;
