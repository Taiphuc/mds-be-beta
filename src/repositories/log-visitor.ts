import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { LogVisitor } from '../models/log-visitor';

export const LogVisitorRepository = dataSource.getRepository(LogVisitor).extend({});
export default LogVisitorRepository;
