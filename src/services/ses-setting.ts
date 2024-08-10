import { TransactionBaseService } from '@medusajs/medusa';
import { SesSetting } from '../models/ses-setting';
import SesSettingRepository from '../repositories/ses-setting';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';

type InjectedDependencies = {
  manager: EntityManager;
  sesSettingRepository: typeof SesSettingRepository;
};

class SesSettingService extends TransactionBaseService {
  protected sesSettingRepository_: typeof SesSettingRepository;

  constructor({ sesSettingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.sesSettingRepository_ = sesSettingRepository;
  }

  async retrieve(): Promise<SesSetting> {
    const sesSettingRepo = this.activeManager_.withRepository(
      this.sesSettingRepository_
    );

    const result = await sesSettingRepo.find();
    return result[0];
  }

  async update(id, data): Promise<boolean> {
    const sesSettingRepo = this.activeManager_.withRepository(
      this.sesSettingRepository_
    );

    const result = await sesSettingRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Ses not found');

    await sesSettingRepo.save({ ...result, ...data });
    return true;
  }
}

export default SesSettingService;
