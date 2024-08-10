import { RouteConfig, RouteProps } from "@medusajs/admin";
import { FlyingBox } from "@medusajs/icons";
import { FC } from "react";
import ShippingPage from "../../components/shared/shipping/ShippingPage";

const Shipping: FC = ({ notify }: RouteProps) => {
  return <ShippingPage notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Shipping",
    icon: FlyingBox,
  },
};

export default Shipping;
