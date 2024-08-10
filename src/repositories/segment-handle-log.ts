import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { SegmentHandleLog } from '../models/segment-handle-log';

export const SegmentHandleLogRepository = dataSource
  .getRepository(SegmentHandleLog)
  .extend({});
export default SegmentHandleLogRepository;
