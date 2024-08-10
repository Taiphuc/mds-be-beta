import { TransactionBaseService } from '@medusajs/medusa';
import MailTemplateRepository from '../repositories/mail-template';
import { EntityManager } from 'typeorm';
import {
  EMailTemplateHtmlReplace,
  EMailAvailableVariables,
} from '../admin/constants/enum';
import { CustomerRepository } from '@medusajs/medusa/dist/repositories/customer';

type InjectedDependencies = {
  manager: EntityManager;
  mailTemplateRepository: typeof MailTemplateRepository;
  customerRepository: typeof CustomerRepository;
  sesService: any;
};

class MailTemplateService extends TransactionBaseService {
  protected mailTemplateRepository_: typeof MailTemplateRepository;
  protected customerRepository_: typeof CustomerRepository;
  protected readonly sesService_: any;

  constructor({
    mailTemplateRepository,
    customerRepository,
    sesService,
  }: InjectedDependencies) {
    super(arguments[0]);
    this.mailTemplateRepository_ = mailTemplateRepository;
    this.customerRepository_ = customerRepository;
    this.sesService_ = sesService;
  }

  async sendMail(data): Promise<boolean> {
    const [templateNormal, templateVip] = await Promise.all([
      this.mailTemplateRepository_.findOne({
        where: { id: data.templateNormalId },
      }),
      this.mailTemplateRepository_.findOne({
        where: { id: data.templateVipId },
      }),
    ]);

    const htmlNormal = templateNormal.data
      .replaceAll(EMailTemplateHtmlReplace.CONTENT, data.content)
      .replaceAll(EMailTemplateHtmlReplace.HEADING, data.heading)
      .replaceAll(EMailTemplateHtmlReplace.PREHEADER, data.preheader);

    const p = [];

    if (data.to === EMailAvailableVariables.GUEST_EMAIL) {
      const customers = await this.customerRepository_.find({
        where: {
          has_account: false,
        },
      });
      customers.forEach((customer) => {
        let html = htmlNormal;
        html.replaceAll(EMailAvailableVariables.GUEST_EMAIL, customer.email);
        p.push(
          this.sesService_.transporter_.sendMail({
            from: data.from,
            to: customer.email,
            subject: data.subject || `No reply`,
            html,
            text: '',
          })
        );
      });
    } else if (data.to === EMailAvailableVariables.USER_EMAIL) {
      const customers = await this.customerRepository_.find({
        where: {
          has_account: true,
        },
      });
      customers.forEach((customer) => {
        let html = htmlNormal;
        html
          .replaceAll(EMailAvailableVariables.USER_EMAIL, customer.email)
          .replaceAll(
            EMailAvailableVariables.USER_FIRST_NAME,
            customer.first_name
          )
          .replaceAll(
            EMailAvailableVariables.USER_LAST_NAME,
            customer.last_name
          );
        p.push(
          this.sesService_.transporter_.sendMail({
            from: data.from,
            to: customer.email,
            subject: data.subject || `No reply`,
            html,
            text: '',
          })
        );
      });
    } else {
      p.push(
        this.sesService_.transporter_.sendMail({
          from: data.from,
          to: data.to,
          subject: data.subject || `No reply`,
          html: htmlNormal,
          text: '',
        })
      );
    }

    return true;
  }
}

export default MailTemplateService;
