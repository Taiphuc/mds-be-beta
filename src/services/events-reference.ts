import { TransactionBaseService } from '@medusajs/medusa';
import { EventsReference } from '../models/events-reference';
import EventsReferenceRepository from '../repositories/events-reference';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

type InjectedDependencies = {
  manager: EntityManager;
  eventsReferenceRepository: typeof EventsReferenceRepository;
};

class EventsReferenceService extends TransactionBaseService {
  protected eventsReferenceRepository_: typeof EventsReferenceRepository;

  constructor({ eventsReferenceRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.eventsReferenceRepository_ = eventsReferenceRepository;
  }

  findByAction(action: string): Promise<EventsReference> {
    const eventsReferenceRepo = this.activeManager_.withRepository(
      this.eventsReferenceRepository_
    );
    return eventsReferenceRepo.findOne({
      where: { action },
    });
  }

  async list(query): Promise<Pagination<EventsReference>> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const eventsReferenceRepo = this.activeManager_.withRepository(
      this.eventsReferenceRepository_
    );

    const queryBuilder = eventsReferenceRepo.createQueryBuilder();

    if (query.action) {
      queryBuilder.where('action = :action', { action: query.action });
    }

    queryBuilder.orderBy('action', 'ASC');

    return paginate<EventsReference>(queryBuilder, { page, limit });
  }

  async update(id, data): Promise<boolean> {
    const eventsReferenceRepo = this.activeManager_.withRepository(
      this.eventsReferenceRepository_
    );

    const result = await eventsReferenceRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Mail template not found'
      );

    await eventsReferenceRepo.save({ ...result, ...data });
    return true;
  }
}

export default EventsReferenceService;
