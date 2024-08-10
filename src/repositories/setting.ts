import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Setting } from '../models/setting';

export const SettingRepository = dataSource.getRepository(Setting).extend({});
export default SettingRepository;
