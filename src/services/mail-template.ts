import { TransactionBaseService } from '@medusajs/medusa';
import { MailTemplate } from '../models/mail-template';
import MailTemplateRepository from '../repositories/mail-template';
import { EntityManager } from 'typeorm';
import { MedusaError } from '@medusajs/utils';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

type InjectedDependencies = {
  manager: EntityManager;
  mailTemplateRepository: typeof MailTemplateRepository;
};

class MailTemplateService extends TransactionBaseService {
  protected mailTemplateRepository_: typeof MailTemplateRepository;

  constructor({ mailTemplateRepository }: InjectedDependencies) {
    super(arguments[0]);
    this.mailTemplateRepository_ = mailTemplateRepository;
  }

  async create(data): Promise<boolean> {
    const mailTemplateRepo = this.activeManager_.withRepository(
      this.mailTemplateRepository_
    );
    await mailTemplateRepo.save(mailTemplateRepo.create(data));
    return true;
  }

  all(): Promise<MailTemplate[]> {
    const mailTemplateRepo = this.activeManager_.withRepository(
      this.mailTemplateRepository_
    );
    return mailTemplateRepo.find();
  }

  list(query): Promise<Pagination<MailTemplate>> {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const mailTemplateRepo = this.activeManager_.withRepository(
      this.mailTemplateRepository_
    );
    return paginate<MailTemplate>(mailTemplateRepo, { page, limit });
  }

  async update(id: string, data): Promise<boolean> {
    const mailTemplateRepo = this.activeManager_.withRepository(
      this.mailTemplateRepository_
    );

    const result = await mailTemplateRepo.findOne({ where: { id } });
    if (!result)
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Mail template not found'
      );

    await mailTemplateRepo.save({ ...result, ...data });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const mailTemplateRepo = this.activeManager_.withRepository(
      this.mailTemplateRepository_
    );

    // todo delete events đang sử dụng template này

    await mailTemplateRepo.softDelete(id);
    return true;
  }
}

export default MailTemplateService;
