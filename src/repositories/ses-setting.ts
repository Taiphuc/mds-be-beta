import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { SesSetting } from '../models/ses-setting';

export const SesSettingRepository = dataSource
  .getRepository(SesSetting)
  .extend({});
export default SesSettingRepository;
