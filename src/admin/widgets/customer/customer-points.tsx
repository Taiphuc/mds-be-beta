import { CustomerDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import PointsTable from "../../components/customer/point/points-table";
const CustomerPoints = (props: CustomerDetailsWidgetProps) => {
  return (
    <PointsTable {...props}/>
  );
};

export const config: WidgetConfig = {
  zone: "customer.details.after",
};

export default CustomerPoints;
