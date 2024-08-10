import { Router } from "express";
import { wrapHandler } from "@medusajs/utils";
import { Request, Response } from "express";
import Medusa from "@medusajs/medusa-js"
import Stripe from "stripe";
import OrderV2Service from "src/services/order-v2";
const router = Router();
import SESService from "src/services/ses";
import * as process from "node:process";
type Shipping = {
    name: string;
    phone: string;
    carrier: string;
    tracking_number: string;
    address: {
        line1: string;
        city: string;
        state: string;
        country: string;
        postal_code: string;
    };
};

type ConfirmParams = {
    return_url: string;
    shipping?: Shipping;
};

const medusa = new Medusa({ baseUrl: process.env.MEDUSA_ADMIN_BE_URL, maxRetries: 3 })

export default (storeRouter: Router) => {
    storeRouter.use("/checkout", router);

    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    router.post(
        "/create-customer",
        wrapHandler(async (req: Request, res: Response) => {
            const { email, name } = req.body;
            const customer = await stripe.customers.create({
                email,
                name,
            });

            res.status(200).send({ data: customer });
        })
    );

    router.post(
        "/create-payment-method",
        wrapHandler(async (req: Request, res: Response) => {
            const {
                type,
                line1,
                city,
                state,
                postal_code,
                country,
                email,
                phone,
                name,
            } = req.body;
            const paymentMethod = await stripe.paymentMethods.create({
                type,
                billing_details: {
                    address: {
                        city,
                        country,
                        line1,
                        postal_code,
                        state,
                    },
                    email,
                    phone,
                    name,
                },
            });

            res.status(200).send({ data: paymentMethod });
        })
    );

    router.post(
        "/create-payment",
        wrapHandler(async (req: Request, res: Response) => {
            const { payment_method, type, amount, currency } = req.body;
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd",
                payment_method,
                payment_method_types: type,
            });

            res.status(200).send({ data: paymentIntent });
        })
    );

    router.post(
        "/confirm",
        wrapHandler(async (req: Request, res: Response) => {
            const orderV2Service: OrderV2Service =
                req.scope.resolve("orderV2Service");
            const {
                id,
                cart_id,
                type,
                line1,
                city,
                country,
                postal_code,
                state,
                name,
                phone,
            } = req.body;

            const order = await orderV2Service.createOrder(cart_id, type);
            if(order) {
                medusa.orders.retrieve(order.id)
                    .then(({ order }) => {
                        const sesService: SESService =
                            req.scope.resolve('sesService');
                        sesService.sendEmail("place_order", process.env.SES_FROM, order.email, order)
                    })

            }

            let confirmParams: ConfirmParams = {
                return_url: `https://demo.vincoleggings.com/order/confirmed/${order?.id}`,
            };

            if (type === "afterpay_clearpay") {
                confirmParams.shipping = {
                    address: {
                        line1,
                        city,
                        country,
                        postal_code,
                        state,
                    },
                    name,
                    phone,
                    carrier: "FedEx",
                    tracking_number: "4242",
                };
            }

            const result = await stripe.paymentIntents.confirm(id, confirmParams);

            res
                .status(200)
                .send({ data: { ...result, return_url: confirmParams.return_url } });
        })
    );
};
