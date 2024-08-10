import { RouteConfig, RouteProps } from "@medusajs/admin";
import { Puzzle } from "@medusajs/icons";
import { FC } from "react";
import CustomProductPage from "../../components/shared/custom-product/CustomProductPage";

const CustomProduct: FC = ({ notify }: RouteProps) => {
  return <CustomProductPage notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Custom products",
    icon: Puzzle,
  },
};

export default CustomProduct;
