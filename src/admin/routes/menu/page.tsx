import { RouteConfig, RouteProps } from "@medusajs/admin";
import { Channels } from "@medusajs/icons";
import { FC } from "react";
import MenuGroup from "../../components/shared/menu/menu-group";
import { Route, Routes } from "react-router-dom";
import MenuPage from "../../components/shared/menu/menu-page";

const MenuAndPage: FC = ({ notify }: RouteProps) => {
  return (
    <Routes>
      <Route index element={<MenuGroup notify={notify} />} />
      <Route path="/:id" element={<MenuPage notify={notify} />} />
    </Routes>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Menu",
    icon: Channels,
  },
};

export default MenuAndPage;
