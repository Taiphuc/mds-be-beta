import { CustomerDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import DiscountsTable from "../../components/customer/point/Discounts-table";
const CustomerDiscountsDiscounts = (props: CustomerDetailsWidgetProps) => {
  return (
    <DiscountsTable {...props}/>
  );
};

export const config: WidgetConfig = {
  zone: "customer.details.after",
};

export default CustomerDiscountsDiscounts;
