import { RouteConfig, RouteProps } from "@medusajs/admin";
import { DocumentText } from "@medusajs/icons";
import { FC } from "react";
import PageManager from "../../components/shared/page-manager";

const MenuAndPage: FC = ({ notify }: RouteProps) => {
  return <PageManager notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Pages",
    icon: DocumentText,
  },
};

export default MenuAndPage;
