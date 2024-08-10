import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { MailTemplate } from '../models/mail-template';

export const MailTemplateRepository = dataSource
  .getRepository(MailTemplate)
  .extend({});
export default MailTemplateRepository;
