import { CustomerDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import AdminDiscountsTable from "../../components/customer/admin-discount/admin-discounts-table";
const CustomerDiscountsDiscounts = (props: CustomerDetailsWidgetProps) => {
  return (
    <AdminDiscountsTable {...props}/>
  );
};

export const config: WidgetConfig = {
  zone: "customer.details.after",
};

export default CustomerDiscountsDiscounts;
