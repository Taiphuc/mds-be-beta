import { TransactionBaseService } from '@medusajs/medusa';
import { SmsSetting } from '../models/sms-setting';
import SmsSettingRepository from '../repositories/sms-setting';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';

type InjectedDependencies = {
  manager: EntityManager;
  smsSettingRepository: typeof SmsSettingRepository;
};

class SmsSettingService extends TransactionBaseService {
  protected smsSettingRepository_: typeof SmsSettingRepository;

  constructor({ smsSettingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.smsSettingRepository_ = smsSettingRepository;
  }

  async retrieve(): Promise<SmsSetting> {
    const smsSettingRepo = this.activeManager_.withRepository(
      this.smsSettingRepository_
    );

    const result = await smsSettingRepo.find();
    return result[0];
  }

  async update(id, data): Promise<boolean> {
    const smsSettingRepo = this.activeManager_.withRepository(
      this.smsSettingRepository_
    );

    const result = await smsSettingRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Sms not found');

    await smsSettingRepo.save({ ...result, ...data });
    return true;
  }
}

export default SmsSettingService;
