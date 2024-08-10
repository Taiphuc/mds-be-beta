import { WidgetConfig } from "@medusajs/admin";
import ReviewTable from "../../components/review/review-table";
const ReviewAll = () => {
  return (
    <ReviewTable />
  );
};

export const config: WidgetConfig = {
  zone: "product.list.after",
};

export default ReviewAll;
