import {
  type SubscriberConfig,
  type SubscriberArgs,
  OrderService,
  CustomerService,
} from "@medusajs/medusa"
import PointService from "../services/point";
import { POINT_TYPE } from "../utils/const/point";
import SettingsService from "../services/settings";
import { SETTING_TYPES } from "../utils/const/settings";

export default async function orderCompleteHandler({
  data, eventName, container, pluginOptions,
}: SubscriberArgs<Record<string, any>>) {
  const pointService: PointService = container.resolve("pointService");
  const customerService: CustomerService = container.resolve("customerService");
  const orderService: OrderService = container.resolve("orderService");
  const settingsService: SettingsService = container.resolve("settingsService");
  const order = await orderService.retrieveWithTotals(data?.id);
  try {
    const customer = await customerService.retrieve(order?.customer_id);
    const settings = await settingsService.retrieve({ type: SETTING_TYPES.point, scope: 'admin' })
    const isVip = (+customer.totalPurchased) / 100 >= +settings?.point?.vip_member_points?.value;
    const ratio = isVip ? +settings?.point?.vip_money_to_point_ratio?.value : +settings?.point?.normal_member_money_to_point_ratio?.value;
    const point = Math.floor((order.subtotal *  ratio) / 100)
    if (customer.has_account) {
      pointService.create({
        customerId: order.customer_id,
        message: 'order completed successfully',
        metadata: {order_id: order.id},
        point: point,
        purchased: order.subtotal,
        type: POINT_TYPE.add_point
      })
    }
  } catch (error) {
    console.log("🚀 => error:", error)
  }
}

export const config: SubscriberConfig = {
  event: OrderService.Events.COMPLETED,
  context: {
    subscriberId: "order-completed-handler",
  },
}