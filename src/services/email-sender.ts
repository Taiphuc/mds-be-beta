import { AbstractNotificationService } from '@medusajs/medusa';
import { EntityManager } from 'typeorm';

class EmailSenderService extends AbstractNotificationService {
  static identifier = 'email-sender';
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;

  sendNotification(
    event: string,
    data: unknown,
    attachmentGenerator: unknown
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, unknown>;
  }> {
    // console.log('event', event);
    // console.log('data', data);

    throw new Error(`SEND MAIL:: Method ${event} not implemented.`);
  }

  resendNotification(
    notification: unknown,
    config: unknown,
    attachmentGenerator: unknown
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, unknown>;
  }> {
    throw new Error(`RESEND MAIL:: Method ${event} not implemented.`);
  }
}

export default EmailSenderService;
