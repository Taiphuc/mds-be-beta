import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { EventsReference } from '../models/events-reference';

export const EventsReferenceRepository = dataSource
  .getRepository(EventsReference)
  .extend({});
export default EventsReferenceRepository;
