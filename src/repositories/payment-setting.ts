import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { PaymentSetting } from '../models/payment-setting';

export const PaymentSettingRepository = dataSource
  .getRepository(PaymentSetting)
  .extend({});
export default PaymentSettingRepository;
