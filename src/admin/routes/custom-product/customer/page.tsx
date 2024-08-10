import { RouteConfig, RouteProps } from "@medusajs/admin";
import { FC } from "react";
import CustomerCustomProduct from "../../../components/shared/custom-product/CustomerCustomProduct";

const CustomProduct: FC = ({ notify }: RouteProps) => {
  return <CustomerCustomProduct notify={notify} />;
};

export default CustomProduct;
