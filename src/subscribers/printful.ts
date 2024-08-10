import { FulFillmentItemType } from "@medusajs/medusa/dist/types/fulfillment";
import { blue, blueBright, green, greenBright, red } from "colorette";
import PrintfulSyncService from "../services/printful-sync";
import { NotificationService, EventBusService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import SESService from "src/services/ses";
import { MAIL_TEMPLATES_AND_TYPES } from "../utils/const/mail";
import MailTemplateRepository from "../repositories/mail-template";
import { EMailTemplateHtmlReplace } from "../admin/constants/enum";

class PrintfulSubscriber {
    private printfulSyncService: PrintfulSyncService;
    private productService: any;
    private orderService_: any;
    private printfulFulfillmentService: any;
    private fulfillmentService: any;
    private printfulService: any;
    private productVariantService: any;
    private paymentService: any;
    private productsQueueService: any;
    private sesService_: SESService;
    private mailTemplateRepository_: typeof MailTemplateRepository;
    private medusaService_: any;

    constructor({
                    eventBusService,
                    orderService,
                    printfulSyncService,
                    productService,
                    printfulFulfillmentService,
                    fulfillmentService,
                    printfulService,
                    productVariantService,
                    paymentService,
                    productsQueueService,
                    notificationService,
                    eventsReferenceService,
                    sesService,
                    mailTemplateRepository,
                    manager,
                    medusaService,
                }: {
        eventBusService: EventBusService;
        orderService: any;
        printfulSyncService: PrintfulSyncService;
        productService: any;
        printfulFulfillmentService: any;
        fulfillmentService: any;
        printfulService: any;
        productVariantService: any;
        paymentService: any;
        productsQueueService: any;
        notificationService: NotificationService;
        eventsReferenceService: any;
        sesService: SESService;
        mailTemplateRepository: typeof MailTemplateRepository;
        manager: EntityManager;
        medusaService:any;
    }) {
        this.printfulSyncService = printfulSyncService;
        this.productService = productService;
        this.printfulFulfillmentService = printfulFulfillmentService;
        this.orderService_ = orderService;
        this.fulfillmentService = fulfillmentService;
        this.printfulService = printfulService;
        this.productVariantService = productVariantService;
        this.paymentService = paymentService;
        this.productsQueueService = productsQueueService;
        this.sesService_ = sesService;
        this.mailTemplateRepository_ = manager.withRepository(mailTemplateRepository);
        this.medusaService_ = medusaService;

        eventBusService.subscribe("printful.start_sync", this.handleSyncPrintfulProducts);
        eventBusService.subscribe("printful.product_updated", this.handlePrintfulProductUpdated);
        eventBusService.subscribe("printful.product_deleted", this.handlePrintfulProductDeleted);
        eventBusService.subscribe("printful.order_updated", this.handlePrintfulOrderUpdated);
        eventBusService.subscribe("printful.order_canceled", this.handlePrintfulOrderCanceled);
        eventBusService.subscribe("printful.package_shipped", this.handlePrintfulPackageShipped);
        eventBusService.subscribe("order.placed", this.handleOrderCreated);
        eventBusService.subscribe("order.updated", this.handleOrderUpdated);
        eventBusService.subscribe("order.completed", this.handleOrderCompleted);
        eventBusService.subscribe("order.canceled", this.handleOrderCanceled);
    }

    handleSyncPrintfulProducts = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [Start sync products]: \n`, data);
        this.printfulSyncService.syncPrintfulProducts();
    };

    handlePrintfulProductUpdated = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [${blueBright(data.type)}]: \n`, data);
        this.productsQueueService.addJob(data.data.sync_product);
    };

    handlePrintfulProductDeleted = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [${blueBright(data.type)}]: \n`, data);
        const existingProduct = await this.productService.retrieveByExternalId(data.data.sync_product.id);
        if (!existingProduct) {
            console.log(`${blue("[printful-service]:")} Product with external id '${blue(data.data.sync_product.id)}' not found in Medusa, nothing to delete!`);
            return;
        }
        await this.productService.delete(existingProduct.id);
        console.log(`${green("[printful-service]:")} Deleted product with external id '${green(data.data.sync_product.id)}' from Medusa! RIP!`);
    };

    handlePrintfulOrderUpdated = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [${blueBright(data.type)}]: \n`, data);

        const order = await this.orderService_.retrieve(data.data.order.external_id, { relations: ["items", "fulfillments", "payments", "shipping_methods", "billing_address"] });

        if (order) {
            switch (data.data.order.status) {
                case "draft":
                    console.log(`${blue("[printful-service]:")} Order ${blue(data.data.order.external_id)} is a draft in Printful!`);
                    break;
                case "pending":
                    console.log(`${blue("[printful-service]:")} Order ${blue(data.data.order.external_id)} has been submitted for fulfillment in Printful!`);
                    try {
                        console.log(`${blue("[printful-service]:")} Capturing payment for order ${blue(data.data.order.external_id)}...`);
                        const capturePayment = await this.orderService_.capturePayment(order.id);
                        if (capturePayment) {
                            console.log(`${green("[printful-service]:")} Successfully captured the payment: `, capturePayment);
                            break;
                        }
                    } catch (e) {
                        console.log(red(e));
                        break;
                    }
                    break;
                case "inprocess":
                    console.log(`${blue("[printful-service]:")} Order ${blue(data.data.order.external_id)} is being fulfilled in Printful!`);

                    try {
                        const itemsToFulfill: FulFillmentItemType[] = order.items.map(i => ({
                            item_id: i.id,
                            quantity: i.quantity,
                        }));

                        const fulfillment = await this.orderService_.createFulfillment(order.id, itemsToFulfill);
                        if (fulfillment) {
                            console.log(`${green("[printful-service]:")} Successfully created fulfillment: `, fulfillment);
                            break;
                        }
                    } catch (e) {
                        console.log(e);
                        break;
                    }
                    break;
                case "canceled":
                    // Handle canceled or archived orders
                    try {
                        return await this.orderService_.cancel(order.id);
                    } catch (e) {
                        console.log(e);
                        throw new Error("Order not found");
                    }
                case "fulfilled":
                    // the order has been successfully fulfilled and shipped
                    // ignoring this event, as we are using the "shipped" event instead
                    break;
                case "reshipment":
                case "partially_shipped":
                case "returned":
                    // Handle other status values
                    break;
                default:
                    // Handle unknown status values
                    break;
            }
        }
    };

    handlePrintfulOrderCanceled = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [${blueBright(data.type)}]: \n`, data);
        try {
            console.log(`${blue("[printful-service]:")} Order ${blue(data.data.order.external_id)} has been canceled in Printful! Trying to cancel in Medusa as well..`);
            const order = await this.orderService_.retrieve(data.data.order.external_id);
            if (order) {
                const canceled = await this.orderService_.cancelOrder(order.id);
                if (canceled) {
                    console.log(`${green("[printful-service]:")} Order ${blue(data.data.order.external_id)} has been successfully canceled in Medusa!`);
                }
            }
        } catch (e) {
            console.log(`${red("[printful-service]:")} Failed to cancel order in Medusa: `, e);
        }
    };

    handlePrintfulPackageShipped = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [${blueBright(data.type)}]: \n`, data);
        const orderData = data.data.order;
        const shipmentData = data.data.shipment;

        const order = await this.orderService_.retrieve(orderData.external_id, { relations: ["items", "fulfillments", "shipping_methods"] });
        if (order) {
            console.log(`${blue("[printful-service]:")} Order ${blue(orderData.external_id)} has been found, preparing to create a shipment in Medusa!`);
            try {
                const trackingLinks = [{ url: shipmentData.tracking_url, tracking_number: shipmentData.tracking_number }];
                console.log(`${blue("[printful-service]:")} Tracking links: `, trackingLinks);
                const createShipment = await this.orderService_.createShipment(order.id, order.fulfillments[0].id, trackingLinks);
                if (createShipment) {
                    console.log(`${green("[printful-service]:")} Successfully created shipment: `, createShipment);
                }
            } catch (e) {
                console.log(`${red("[printful-service]:")} Failed to create shipment in Medusa: `, e);
            }
        }
    };

    handleOrderCreated = async (data: any, event: string) => {
        const medusa = this.medusaService_.medusaAdmin();
        const order = await medusa.admin.orders.retrieve(data.id);
        console.log("🚀 => data_3 => response:", data)
        console.log("🚀 => data_placeOrder_3 => response:", data)

        const dataTemplate = {
            subtotal: order.order.subtotal / 100 + " " + order.order?.currency_code,
            shipping_total: order.order.shipping_total / 100 + " " + order.order?.currency_code,
            tax_total: order.order.tax_total / 100 + " " + order.order?.currency_code,
            total: order.order.total / 100 + " " + order.order?.currency_code,
        };

        await this.sesService_.sendEmail("place_order", process.env.SES_FROM, order.order.email, dataTemplate);
    };

    handleOrderUpdated = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [Order updated]: \n`, data);
    };

    handleOrderCompleted = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [Order completed]: \n`, data);
    };

    handleOrderCanceled = async (data: any) => {
        console.log(`${blueBright("[printful-service]:")} Received a webhook event from Printful! [Order canceled]: \n`, data);
    };

    replaceHtml = (html: string, content: string, heading: string, preheader: string) => {
        return html
            .replaceAll(EMailTemplateHtmlReplace.CONTENT, content)
            .replaceAll(EMailTemplateHtmlReplace.HEADING, heading)
            .replaceAll(EMailTemplateHtmlReplace.PREHEADER, preheader);
    };
}

export default PrintfulSubscriber;
