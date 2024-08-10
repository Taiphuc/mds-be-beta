import { RouteConfig, RouteProps } from "@medusajs/admin";
import { Sidebar } from "@medusajs/icons";
import { FC } from "react";
import OptionPage from "../../components/shared/option-page";

const OptionPagePage: FC = ({ notify }: RouteProps) => {
  return <OptionPage notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Option page",
    icon: Sidebar,
  },
};

export default OptionPagePage;
