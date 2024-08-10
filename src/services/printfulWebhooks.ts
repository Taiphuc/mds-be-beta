import { TransactionBaseService } from "@medusajs/medusa"
import { greenBright } from "colorette";
import { SETTING_TYPES } from "../utils/const/settings";
import SettingsService from "./settings";
import { toBoolean } from "../utils/boolean";
import PrintfulRequestService from "./printful-request";


class PrintfulWebhooksService extends TransactionBaseService {
    private storeId: any;
    private backendUrl: any;
    private printfulClient: PrintfulRequestService;
    private eventBusService: any;
    private enableWebhooks: any;
    private settingsService: SettingsService;
    private printfulAccessToken: any;


    constructor(container, options) {
        super(container);
        this.settingsService = container.settingsService;
        this.eventBusService = container.eventBusService;
        this.manager_ = container.manager;
        this.printfulClient = container.printfulRequestService
        this.applySettings();
    }

    async applySettings() {
        const settings = await this.settingsService.retrieve({ scope: 'admin', type: SETTING_TYPES.fulfillment })
        this.storeId = settings?.fulfillment?.printful_store_id?.value;
        this.printfulAccessToken = settings?.fulfillment?.printful_access_token?.value;
        this.backendUrl = process.env.BE_URL;
        await this.printfulClient.init(this.printfulAccessToken, this.storeId)
        this.enableWebhooks = toBoolean(settings?.fulfillment?.printful_enable_webhooks?.value);
    }

    async createWebhooks() {
        
        console.log(`${greenBright("[printful-service]:")} Creating Printful Webhooks!`)
        const currentWebhookConfig = await this.printfulClient?.get("webhooks", { store_id: this.storeId });
        console.log(`${greenBright("[printful-service]: ")} Your current Printful Webhook configuration: `, currentWebhookConfig)
        if (currentWebhookConfig?.url !== `${this.backendUrl}/printful/webhook`) {
            const webhookTypes = [
                "package_shipped",
                "package_returned",
                "order_created",
                "order_updated",
                "order_failed",
                "order_canceled",
                "product_updated",
                "product_deleted",
                "order_put_hold",
                "order_put_hold_approval",
                "order_remove_hold",
            ]

            const setWebhookConfig = await this.printfulClient.post("webhooks", {
                store_id: this.storeId,
                url: `${this.backendUrl}/printful/webhook`,
                types: webhookTypes,
            });
            if (setWebhookConfig.code === 200) {
                console.log(`${greenBright("[printful-service]:")} Printful Webhook Support is enabled! `);
            }
        } else {
            console.log(`${greenBright("[printful-service]:")} Printful Webhook Support is already enabled! `);
        }
    }

    async disableWebhooks() {
        const webhooksDisabled = await this.printfulClient.delete("webhooks", { store_id: this.storeId });
        if (webhooksDisabled.code === 200) {
            return "Printful Webhook Support is disabled! 👀"
        }
    }

    async handleWebhook(data) {
        switch (data.type) {
            case "product_updated": {
                console.log("Emitting event: printful.product_updated")
                this.eventBusService.emit("printful.product_updated", data)
                break;
            }
            case "product_deleted": {
                this.eventBusService.emit("printful.product_deleted", data)
                break;
            }
            case "package_shipped": {
                this.eventBusService.emit("printful.package_shipped", data)
                break;
            }
            case "package_returned": {
                this.eventBusService.emit("printful.package_returned", data)
                break;
            }
            case "order_created": {
                this.eventBusService.emit("printful.order_created", data)
                break;
            }
            case "order_updated": {
                this.eventBusService.emit("printful.order_updated", data)
                break;
            }

        }
    }
}

export default PrintfulWebhooksService;