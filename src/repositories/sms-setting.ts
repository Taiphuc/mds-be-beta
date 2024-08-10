import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { SmsSetting } from '../models/sms-setting';

export const SmsSettingRepository = dataSource
  .getRepository(SmsSetting)
  .extend({});
export default SmsSettingRepository;
