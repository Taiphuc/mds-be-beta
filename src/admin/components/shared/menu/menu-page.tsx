import { RouteProps } from "@medusajs/admin";
import { useToggleState } from "@medusajs/ui";
import { useAdminCustomQuery } from "medusa-react";
import { createContext, FC, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Menu } from "../../../../models/menu";
import BackButton from "../back-button";
import BodyCard from "../body-card";
import Spacer from "../spacer";
import AddEditMenuSideModal from "./add-edit-menu";
import MenuList from "./menu-list";

export const MenuContext = createContext<{
  editMenu: (menu: Menu) => void;
  createSubMenu: (menu: Menu) => void;
}>({} as any);

const MenuPage: FC<RouteProps> = ({ notify }) => {
  const { state: isEditModalVisible, open: showEditModal, close: hideEditModal } = useToggleState();
  const [activeMenu, setActiveMenu] = useState<Menu | null>(null);
  const [parentMenu, setParentMenu] = useState<Menu | null>(null);
  const params = useParams();
  const [searchParams] = useSearchParams();
  const {
    data: dataMainMenu,
    isLoading: isLoadingMainMenu,
    refetch: refetchMainMenu,
  } = useAdminCustomQuery<{ parent_id: string }, { data: Menu[] }>("/menu/items", [], {
    parent_id: params?.id,
  });
  const mainMenu = dataMainMenu?.data;
  const editMenu = (menu: Menu) => {
    setActiveMenu(menu);
    showEditModal();
  };
  const createSubMenu = (menu: Menu) => {
    setParentMenu(menu);
    showEditModal();
  };
  const context = {
    editMenu,
    createSubMenu,
  };
  const refetchData = () => {
    refetchMainMenu();
  };

  useEffect(() => {
    if (!isEditModalVisible) {
      setActiveMenu(null);
      setParentMenu(null);
    }
  }, [isEditModalVisible]);

  return (
    <MenuContext.Provider value={context}>
      <BackButton path="/a/menu" label="Back to Products" className="mb-xsmall" />
      <BodyCard
        className="h-full"
        title={`${searchParams.get("name")} group`}
        subtitle={"Manage menus of group " + searchParams.get("name")}
        actionables={[
          {
            label: "Add Menu",
            onClick: showEditModal,
          },
        ]}
        footerMinHeight={40}
        setBorders
      >
        <MenuList menu={mainMenu} notify={notify} refetch={refetchMainMenu} />
      </BodyCard>
      <Spacer />
      <AddEditMenuSideModal
        close={hideEditModal}
        activeMenu={activeMenu}
        isVisible={isEditModalVisible}
        notify={notify}
        reload={refetchData}
        parentMenu={parentMenu}
      />
    </MenuContext.Provider>
  );
};
export default MenuPage;
