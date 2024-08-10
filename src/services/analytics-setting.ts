import { TransactionBaseService } from '@medusajs/medusa';
import { AnalyticsSetting } from '../models/analytics-setting';
import AnalyticsSettingRepository from '../repositories/analytics-setting';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';

type InjectedDependencies = {
  manager: EntityManager;
  analyticsSettingRepository: typeof AnalyticsSettingRepository;
};

class AnalyticsSettingService extends TransactionBaseService {
  protected analyticsSettingRepository_: typeof AnalyticsSettingRepository;

  constructor({ analyticsSettingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.analyticsSettingRepository_ = analyticsSettingRepository;
  }

  async retrieve(): Promise<AnalyticsSetting[]> {
    const analyticsSettingRepo = this.activeManager_.withRepository(
      this.analyticsSettingRepository_
    );

    const result = await analyticsSettingRepo.find({
      order: {
        id: 'ASC',
      },
    });
    return result;
  }

  async update(id, data): Promise<boolean> {
    const analyticsSettingRepo = this.activeManager_.withRepository(
      this.analyticsSettingRepository_
    );

    const result = await analyticsSettingRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Analytics not found');

    await analyticsSettingRepo.save({ ...result, ...data });
    return true;
  }
}

export default AnalyticsSettingService;
