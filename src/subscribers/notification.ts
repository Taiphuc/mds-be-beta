import { NotificationService, EventBusService } from "@medusajs/medusa";
import { EAllEventsReference, EMailTemplateHtmlReplace } from "../admin/constants/enum";
import EventsReferenceService from "../services/events-reference";
import MailTemplateRepository from "../repositories/mail-template";
import { EntityManager } from "typeorm";
import SESService from "src/services/ses";
import { MAIL_TEMPLATES_AND_TYPES } from "../utils/const/mail";
import setTimeout = jest.setTimeout;

type InjectedDependencies = {
  manager: EntityManager;
  eventBusService: EventBusService;
  notificationService: NotificationService;
  eventsReferenceService: EventsReferenceService;
  medusaService: any;
  sesService: SESService;
  mailTemplateRepository: typeof MailTemplateRepository;
};

class NotificationSubscriber {
  protected readonly sesService_: SESService;
  protected readonly eventsReferenceService_: EventsReferenceService;
  protected readonly notificationService_: NotificationService;
  protected readonly medusaService_: any;
  protected readonly mailTemplateRepository_: typeof MailTemplateRepository;

  constructor({
    notificationService,
    eventsReferenceService,
    eventBusService,
    sesService,
    medusaService,
    mailTemplateRepository,
    manager,
  }: InjectedDependencies) {
    this.sesService_ = sesService;
    this.medusaService_ = medusaService;
    this.eventsReferenceService_ = eventsReferenceService;
    this.notificationService_ = notificationService;
    this.mailTemplateRepository_ = manager.withRepository(mailTemplateRepository);

    // eventBusService.subscribe(EAllEventsReference.BATCH_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_PRE_PROCESSED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_CONFIRMED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_PROCESSING, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_COMPLETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.BATCH_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CART_CUSTOMER_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CART_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CART_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_FULFILLMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_SHIPMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_REFUND_PROCESSED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_ITEM_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_ITEM_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CLAIM_ITEM_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CURRENCY_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CUSTOMER_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.CUSTOMER_UPDATED, this.handleSendMailCommon);
    eventBusService.subscribe(EAllEventsReference.CUSTOMER_PASSWORD_RESET, this.resetPassword);
    // eventBusService.subscribe(EAllEventsReference.DRAFT_ORDER_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.DRAFT_ORDER_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.GIFT_CARD_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_ITEM_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_ITEM_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_ITEM_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_LEVEL_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_LEVEL_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.INVENTORY_LEVEL_DELETED, this.handleSendMailCommon);
    eventBusService.subscribe(EAllEventsReference.INVITE_CREATED, this.handleInviteCreated);
    // eventBusService.subscribe(EAllEventsReference.NOTE_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.NOTE_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.NOTE_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_PLACED, this.placeOrder);
    // eventBusService.subscribe(EAllEventsReference.ORDER_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_COMPLETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_ORDERS_CLAIMED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_GIFT_CARD_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_PAYMENT_CAPTURED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_PAYMENT_CAPTURE_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_FULFILLMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_SHIPMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_FULFILLMENT_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_RETURN_REQUESTED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_ITEMS_RETURNED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_RETURN_ACTION_REQUIRED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_REFUND_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_REFUND_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_SWAP_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_CANCELED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_DECLINED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_REQUESTED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_CONFIRMED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_ITEM_CHANGE_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_EDIT_ITEM_CHANGE_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_PAYMENT_CAPTURED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_PAYMENT_CAPTURE_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_PAYMENT_REFUND_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_PAYMENT_REFUND_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_COLLECTION_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_COLLECTION_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_COLLECTION_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PAYMENT_COLLECTION_PAYMENT_AUTHORIZED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_CATEGORY_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_CATEGORY_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_CATEGORY_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_VARIANT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_VARIANT_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PRODUCT_VARIANT_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PUBLISHABLE_API_KEY_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.PUBLISHABLE_API_KEY_REVOKED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.REGION_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.REGION_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.REGION_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.RESERVATION_ITEM_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.RESERVATION_ITEM_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.RESERVATION_ITEM_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SALES_CHANNEL_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SALES_CHANNEL_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SALES_CHANNEL_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.STOCK_LOCATION_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.STOCK_LOCATION_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.STOCK_LOCATION_DELETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_RECEIVED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_FULFILLMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_SHIPMENT_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_PAYMENT_COMPLETED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_PAYMENT_CAPTURED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_PAYMENT_CAPTURE_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_REFUND_PROCESSED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.SWAP_PROCESS_REFUND_FAILED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.ORDER_UPDATE_TOKEN_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.USER_CREATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.USER_UPDATED, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.USER_PASSWORD_RESET, this.handleSendMailCommon);
    // eventBusService.subscribe(EAllEventsReference.USER_DELETED, this.handleSendMailCommon);
  }

  handleSendMailCommon = async (data: any, event: string) => {
    // const mailtemplateConfig = await this.eventsReferenceService_.findByAction(
    //   event
    // );
    // if (mailtemplateConfig.is_active) {
    //   let toEmail: string;
    //   switch (event) {
    //     case EAllEventsReference.CUSTOMER_CREATED:
    //       toEmail = data.email;
    //       break;
    //     case EAllEventsReference.CUSTOMER_UPDATED:
    //       toEmail = data.email;
    //       break;
    //     case EAllEventsReference.CUSTOMER_PASSWORD_RESET:
    //       toEmail = data.email;
    //       break;
    //     case EAllEventsReference.USER_PASSWORD_RESET:
    //       toEmail = data.email;
    //       break;
    //     default:
    //       break;
    //   }
    //   if (toEmail) {
    //     await this.sesService_.transporter_.sendMail({
    //       from: process.env.SES_FROM,
    //       to: toEmail,
    //       subject: mailtemplateConfig.subject || `No reply ${event}`,
    //       html: mailtemplateConfig.template_normal || '',
    //       text: '',
    //     });
    //   } else {
    //     throw new Error(`SEND MAIL:: Method ${event} not implemented.`);
    //   }
    // }
  };

  // placeOrder = async (data: any, event: string) => {
  //   console.log("🚀 => data_1=> response:", data)
  //   medusa.admin.orders.retrieve(data.id)
  //       .then(({ order }) => {
  //         console.log("🚀 => data_placeOrder_1 => response:", data)
  //       })
  //
  //
  //   // const dataTemplate = {
  //   //   subtotal: order.order.subtotal / 100 + " " + order.order?.currency_code,
  //   //   shipping_total: order.order.shipping_total / 100 + " " + order.order?.currency_code,
  //   //   tax_total: order.order.tax_total / 100 + " " + order.order?.currency_code,
  //   //   total: order.order.total / 100 + " " + order.order?.currency_code,
  //   // };
  //
  //   // await this.sesService_.sendEmail("place_order", process.env.SES_FROM, order.order.email, dataTemplate);
  // };

  handleInviteCreated = async (data: any, event: string) => {
    data.url = process.env.FE_URL + "/invite?token=" + data.token;
    await this.sesService_.sendEmail("invite", process.env.SES_FROM, data.user_email, data);
  };

  resetPassword = async (data: any, event: string) => {
    const mailTemplate = await this.mailTemplateRepository_.findOne({ where: { title: MAIL_TEMPLATES_AND_TYPES.customer_reset_password } });
    data.url = process.env.FE_URL + "/reset-password?token=" + data.token + "&email=" + data.email;
    const html = this.replaceHtml(mailTemplate.data, data.url, "", "");

    try {
      await this.sesService_.sendEmailWithoutTemplate({
        from: process.env.SES_FROM,
        to: data.email,
        subject: `No reply`,
        html,
        text: "",
      });
    } catch (error) {
      throw new Error("cannot send email");
    }
  };

  replaceHtml = (html: string, content: string, heading: string, preheader: string) => {
    return html
      .replaceAll(EMailTemplateHtmlReplace.CONTENT, content)
      .replaceAll(EMailTemplateHtmlReplace.HEADING, heading)
      .replaceAll(EMailTemplateHtmlReplace.PREHEADER, preheader);
  };
}

export default NotificationSubscriber;
