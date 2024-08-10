import type { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import ProductMedia from "../../components/product/media";

const ProductMediaWidget = (props: ProductDetailsWidgetProps) => {
  return <ProductMedia  {...props}/>;
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default ProductMediaWidget;
