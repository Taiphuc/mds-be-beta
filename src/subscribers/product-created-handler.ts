import {
  ProductService,
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/medusa"
import SegmentService from "../services/segment";


export default async function productCreatedHandler({
  data, eventName, container, pluginOptions,
}: SubscriberArgs<Record<string, any>>) {

  const segmentService: SegmentService = container.resolve(
    "segmentService"
  )
  const { id: productId } = data;
  await segmentService.sendMailSubscribeNewProduct(productId)
}

export const config: SubscriberConfig = {
  event: ProductService.Events.CREATED,
  context: {
    subscriberId: "product-created-handler",
  },
}