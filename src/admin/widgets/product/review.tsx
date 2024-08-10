import type { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";
import ReviewTable from "../../components/review/review-table";
import { Product } from "../../../models/product";

type ProductReviewWidgetProps = {
  product: Product;
};

const ProductReviewWidget = ({ product }: ProductReviewWidgetProps) => {
  return <ReviewTable id={product?.id} product={product} />;
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default ProductReviewWidget;
