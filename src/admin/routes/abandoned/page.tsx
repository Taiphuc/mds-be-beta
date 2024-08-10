import { RouteConfig, RouteProps } from "@medusajs/admin";
import { InboxSolid } from "@medusajs/icons";
import { FC } from "react";
import AbandonedPage from "../../components/shared/abandoned/AbandonedPage";

const Abandoned: FC = ({ notify }: RouteProps) => {
  return <AbandonedPage notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Abandoned",
    icon: InboxSolid,
  },
};

export default Abandoned;
