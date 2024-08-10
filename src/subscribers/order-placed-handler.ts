import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
} from "@medusajs/medusa"
import OrderRepository from "../repositories/order";
import ProductRepository from "../repositories/product";
import ProductVariantRepository from "../repositories/variant";

export default async function orderPlacedHandler({
  data, eventName, container, pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
  const productRepository: typeof ProductRepository = container.resolve(
    "productRepository"
  )
  const productVariantRepository: typeof ProductVariantRepository = container.resolve(
    "productVariantRepository"
  )
  const orderRepo: typeof OrderRepository = container.resolve(
    "orderRepository"
  )
  const order = await orderRepo.findOne({ where: { id: data?.id }, relations: { cart: { items: { variant: { product: true } } } } });
  console.log("🚀 => data_placeOrder_2 => response:", data)
  try {
    const updatedProducts = [];
    order?.cart?.items?.forEach(item => {
      item.variant.soldCount = item?.variant?.soldCount ? item?.variant?.soldCount + item.quantity : item.quantity
      item.variant.product.soldCount = item?.variant?.product?.soldCount ? item?.variant?.product?.soldCount + item.quantity : item.quantity
      updatedProducts.push(productVariantRepository.save({ id: item?.variant_id, soldCount: item.variant.soldCount }))
      updatedProducts.push(productRepository.save({ id: item?.variant.product_id, soldCount: item.variant.product.soldCount }))
    });

    await Promise.allSettled(updatedProducts)
  } catch (error) {
    console.log("🚀 => error:", error)
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.PLACED,
  context: {
    subscriberId: "order-placed-handler",
  },
}