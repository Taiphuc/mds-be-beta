import { FulfillmentService } from "medusa-interfaces";
import { Fulfillment } from "@medusajs/medusa";
import { toUpper } from "lodash";
import SettingsService from "./settings";
import { SETTING_TYPES } from "../utils/const/settings";
import PrintfulRequestService from "./printful-request";

class PrintfulFulfillmentService extends FulfillmentService {
    static identifier = "printful";

    private orderService: any;
    private printfulService: any;
    private printfulClient: PrintfulRequestService;
    private fulfillmentService: any;
    private settingsService: SettingsService;
    private storeId: any;

    constructor(container, options) {
        super();
        this.orderService = container.orderService;
        this.printfulService = container.printfulService;
        this.settingsService = container.settingsService;
        this.fulfillmentService = container.fulfillmentService;
        this.printfulClient = container.printfulRequestService
        this.storeId = options.storeId;
        this.applySettings()
    }

    async applySettings() {
        const settings = await this.settingsService.retrieve({ scope: 'admin', type: SETTING_TYPES.fulfillment })
        this.storeId = settings?.fulfillment?.printful_store_id?.value;
        await this.printfulClient.init(settings?.fulfillment?.printful_access_token?.value, this.storeId)
    }

    async getFulfillmentOptions() {
        return [
            {
                id: "STANDARD",
                name: "Printful Default"
            },
            {
                id: "PRINTFUL_FAST",
                name: "Printful Express"
            },
            {
                id: "printful-return",
                name: "Printful Return",
                is_return: true
            }
        ]
    }

    async validateOption(data) {
        console.log("validateOption", data)
        return true;
    }

    async validateFulfillmentData(optionData, data, cart) {
        console.log("validateFulfillmentData", optionData, data, cart)
        console.log("Data", data)
        return {
            ...optionData,
            ...data,
        };
    }

    async createFulfillment(methodData, fulfillmentItems, order, fulfillment) {
        const { shipping_address } = order;

        const addr = {
            name: `${shipping_address.first_name} ${shipping_address.last_name}`,
            address1: shipping_address.address_1,
            address2: shipping_address.address_2,
            zip: shipping_address.postal_code,
            city: shipping_address.city,
            state_code: shipping_address.province,
            country_code: shipping_address.country_code.toUpperCase(),
            phone: shipping_address.phone,
            email: order.email,
        };

        const printfulItems = fulfillmentItems.map((item) => ({
            external_id: item.id,
            sync_variant_id: item.variant.metadata.printful_id,
            quantity: item.quantity,
        }));

        const newOrder = {
            external_id: order.id,
            items: printfulItems,
            recipient: addr,
            shipping: methodData.printful_id,
        };

        return this.printfulClient
            .post("orders", newOrder)
            .then(({ result }) => result);
    }

    canCalculate(data) {
        if (data.id === "STANDARD" || data.id === "PRINTFUL_FAST") {
            return true;
        }
    }

    async createShipment(data) {
        const { shipment, order } = data;
    
        const orderId = order.order.external_id;
    
        const medusaOrder = await this.orderService.retrieve(orderId, {
          relations: ["fulfillments"],
        });
    
        const fulfillment = medusaOrder.fulfillments[0];
    
        const trackingLinks = [
          {
            url: shipment.tracking_url,
            tracking_number: shipment.tracking_number,
          },
        ];
    
        return this.orderService.createShipment(
          orderId,
          fulfillment.id,
          trackingLinks
        );
      }

    async calculatePrice(optionData, data, cart) {
        console.log("calculatePrice: ", optionData, data)
        try {
            const { code, result } = await this.printfulService.getShippingRates({
                recipient: {
                    address1: cart.shipping_address.address_1,
                    city: cart.shipping_address.city,
                    country_code: toUpper(cart.shipping_address.country_code),
                    zip: cart.shipping_address.postal_code,
                    phone: cart.shipping_address.phone || null,
                },
                items: cart.items.map(item => {
                    return {
                        variant_id: item.variant.metadata.printful_catalog_variant_id,
                        quantity: item.quantity
                    }
                }),
                locale: "de_DE"
            })
            if (code === 200) {
                // return the rate where optionData.id is the same as the id of the result
                const shippingOption = result.find(option => option.id === optionData.id);
                if (shippingOption) {
                    return parseInt((shippingOption.rate * 100).toString(), 10);
                } else {

                    console.log(`Shipping option ${optionData.id} not found`);
                }

            }

        } catch (e) {
            console.log(e)
        }
    }

    async getShippingRates({ recipient, items }) {
        const rates = await this.printfulClient
            .post("shipping/rates", { recipient, items })
            .then(({ result }) => result);

        return rates.map((r) => ({
            id: r.name,
            printful_id: r.id,
            name: r.name,
            min_delivery_days: r.minDeliveryDays,
            max_delivery_days: r.maxDeliveryDays,
        }));
    }

    async cancelFulfillment(fulfillment) {
        // TODO: call printful api to cancel fulfillment
        return Promise.resolve(<Fulfillment>{})
    }

}

export default PrintfulFulfillmentService;