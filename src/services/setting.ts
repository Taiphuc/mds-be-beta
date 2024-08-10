import { TransactionBaseService } from '@medusajs/medusa';
import { Setting } from '../models/setting';
import SettingRepository from '../repositories/setting';
import { EntityManager, IsNull, Not } from 'typeorm';
import { MedusaError } from '@medusajs/utils';

type InjectedDependencies = {
  manager: EntityManager;
  settingRepository: typeof SettingRepository;
};

class SettingService extends TransactionBaseService {
  protected settingRepository_: typeof SettingRepository;

  constructor({ settingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.settingRepository_ = settingRepository;
  }

  async retrieve(): Promise<Setting> {
    const settingRepo = this.activeManager_.withRepository(
      this.settingRepository_
    );

    const result = await settingRepo.find();
    return result[0];
  }

  async update(data): Promise<boolean> {
    try {
      const settingRepo = this.activeManager_.withRepository(
        this.settingRepository_
      );

      const result = await settingRepo.findOne({
        where: { id: Not(IsNull()) },
      });
      if (!result)
        throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Setting not found');

      await settingRepo.save({ ...result, ...data });
      return true;
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}

export default SettingService;
