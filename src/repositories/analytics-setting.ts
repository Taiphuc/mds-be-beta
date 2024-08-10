import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { AnalyticsSetting } from '../models/analytics-setting';

export const AnalyticsSettingRepository = dataSource
  .getRepository(AnalyticsSetting)
  .extend({});
export default AnalyticsSettingRepository;
