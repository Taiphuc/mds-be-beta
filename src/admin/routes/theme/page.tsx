import { RouteConfig, RouteProps } from "@medusajs/admin";
import { Puzzle } from "@medusajs/icons";
import { FC } from "react";
import Theme from "../../components/shared/theme";

const ThemePage: FC = ({ notify }: RouteProps) => {
  return <Theme notify={notify} />;
};

export const config: RouteConfig = {
  link: {
    label: "Themes",
    icon: Puzzle,
  },
};

export default ThemePage;
