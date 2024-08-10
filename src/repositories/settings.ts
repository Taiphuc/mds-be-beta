import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Settings } from '../models/settings';

export const SettingsRepository = dataSource.getRepository(Settings).extend({});
export default SettingsRepository;
