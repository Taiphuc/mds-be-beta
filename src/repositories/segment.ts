import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Segment } from '../models/segment';

export const SegmentRepository = dataSource.getRepository(Segment).extend({});
export default SegmentRepository;
