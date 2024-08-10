import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { GoogleMerchantSetting } from '../models/google-merchant-setting';

export const GoogleMerchantSettingRepository = dataSource
  .getRepository(GoogleMerchantSetting)
  .extend({});
export default GoogleMerchantSettingRepository;
