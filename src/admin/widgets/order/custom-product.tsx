import type { WidgetConfig, OrderDetailsWidgetProps } from "@medusajs/admin";
import OrderCustomProduct from "../../components/order/custom-product/order-custom-product";

const CustomProductWidget = (props: OrderDetailsWidgetProps) => {
  return <OrderCustomProduct  {...props}/>;
};

export const config: WidgetConfig = {
  zone: "order.details.before",
};

export default CustomProductWidget;
