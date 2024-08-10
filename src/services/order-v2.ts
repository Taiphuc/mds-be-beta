import {
    Cart,
    CartService,
    LineItem,
    Order,
    Payment,
    PaymentStatus,
    ProductOption,
    ProductVariant,
    TransactionBaseService,
} from "@medusajs/medusa";
import { Product } from "../models/product";
import { EntityManager, In } from "typeorm";
import OrderRepository from "@medusajs/medusa/dist/repositories/order";
import { LineItemService } from "@medusajs/medusa/dist/services";
import PaymentRepository from "@medusajs/medusa/dist/repositories/payment";
import CartRepository from "@medusajs/medusa/dist/repositories/cart";

type InjectedDependencies = {
    manager: EntityManager;
    orderRepository: typeof OrderRepository;
    paymentRepository: typeof PaymentRepository;
    cartRepository: typeof CartRepository;
    cartService: CartService;
    lineItemService: LineItemService;
};

class OrderV2Service extends TransactionBaseService {
    protected orderRepository_: typeof OrderRepository;
    protected paymentRepository_: typeof PaymentRepository;
    protected cartRepository_: typeof CartRepository;
    protected cartService_: CartService;
    protected lineItemService_: LineItemService;

    constructor({
                    orderRepository,
                    paymentRepository,
                    cartService,
                    lineItemService,
                    cartRepository,
                    manager,
                }: InjectedDependencies) {
        super(arguments[0]);
        this.orderRepository_ = orderRepository;
        this.paymentRepository_ = paymentRepository;
        this.cartService_ = cartService;
        this.lineItemService_ = lineItemService;
        this.cartRepository_ = cartRepository;
    }

    async createOrder(cart_id: string, type: string) {
        return await this.manager_.transaction(
            async (transactionalEntityManager) => {
                const orderRepository = transactionalEntityManager.getRepository(Order);
                const paymentRepository =
                    transactionalEntityManager.getRepository(Payment);
                const lineItemRepository =
                    transactionalEntityManager.getRepository(LineItem);
                const cartRepository = transactionalEntityManager.getRepository(Cart);

                const cart = await this.cartService_.retrieveWithTotals(cart_id, {
                    relations: ["items", "shipping_methods"],
                });

                if (!cart) throw new Error("Cart does not exist");

                const shippingMethods = cart.shipping_methods.map((method) => {
                    method.tax_lines = undefined;
                    return method;
                });

                const rawOrder = orderRepository.create({
                    payment_status: PaymentStatus.AWAITING,
                    discounts: cart.discounts,
                    gift_cards: cart.gift_cards,
                    shipping_methods: shippingMethods,
                    shipping_address_id: cart.shipping_address_id,
                    billing_address_id: cart.billing_address_id,
                    region_id: cart.region_id,
                    email: cart.email,
                    customer_id: cart.customer_id,
                    cart_id: cart.id,
                    currency_code: "usd",
                    metadata: cart.metadata || {},
                });
                const order = await this.orderRepository_.save(rawOrder);

                const rawPayment = paymentRepository.create({
                    order_id: order.id,
                    cart_id: cart.id,
                    amount: cart.total,
                    currency_code: "usd",
                    provider_id: type,
                    data: {},
                });
                const payment = await this.paymentRepository_.save(rawPayment);

                await lineItemRepository.update({ cart_id }, { order_id: order?.id });

                await cartRepository.update(
                    { id: cart_id },
                    { payment_id: payment?.id, completed_at: new Date() }
                );

                return order;
            }
        );
    }
}

export default OrderV2Service;
