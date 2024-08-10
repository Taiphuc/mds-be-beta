import { TransactionBaseService } from '@medusajs/medusa';
import { PaymentSetting } from '../models/payment-setting';
import PaymentSettingRepository from '../repositories/payment-setting';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';

type InjectedDependencies = {
  manager: EntityManager;
  paymentSettingRepository: typeof PaymentSettingRepository;
};

class PaymentSettingService extends TransactionBaseService {
  protected paymentSettingRepository_: typeof PaymentSettingRepository;

  constructor({ paymentSettingRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.paymentSettingRepository_ = paymentSettingRepository;
  }

  async retrieve(): Promise<PaymentSetting[]> {
    const paymentSettingRepo = this.activeManager_.withRepository(
      this.paymentSettingRepository_
    );

    const result = await paymentSettingRepo.find({
      order: {
        id: 'ASC',
      },
    });
    return result;
  }

  async publicKeyByType(type: string): Promise<string> {
    const paymentSettingRepo = this.activeManager_.withRepository(
      this.paymentSettingRepository_
    );

    const result = await paymentSettingRepo.findOne({ where: { type } });
    if (!result)
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Payment not found');

    return result.public_key;
  }

  async update(id, data): Promise<boolean> {
    const paymentSettingRepo = this.activeManager_.withRepository(
      this.paymentSettingRepository_
    );

    const result = await paymentSettingRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Payment not found');

    await paymentSettingRepo.save({ ...result, ...data });
    return true;
  }
}

export default PaymentSettingService;
