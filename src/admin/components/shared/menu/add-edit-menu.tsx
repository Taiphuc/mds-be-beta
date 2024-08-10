import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useAdminCustomPost } from "medusa-react";
import { Menu } from "src/models/menu";
import { RouteProps } from "@medusajs/admin";
import SideModal from "../../modal/side-modal";
import Button from "../button";
import CrossIcon from "../icons/cross-icon";
import InputField from "../../input";
import { Text } from "@medusajs/ui";
import { useParams } from "react-router-dom";
import SearchLink from "../../input/search-link";

interface AddEditMenuSideModalProps extends RouteProps {
  activeMenu?: Menu;
  close: () => void;
  isVisible: boolean;
  reload: () => void;
  parentMenu: Menu;
}

export type MenuUpdateReq = {
  id?: string;
  parent_id?: string;
  title?: string;
  link?: string;
};

/**
 * Modal for editing product categories
 */
function AddEditMenuSideModal(props: AddEditMenuSideModalProps) {
  const params = useParams();
  const { isVisible, close, activeMenu, notify, reload, parentMenu } = props;
  const [menu, setMenu] = useState({ title: "", link: "" } as MenuUpdateReq);
  const isUpdate = !!activeMenu;

  const { mutateAsync: updateMenu } = useAdminCustomPost<any, any>(`/menu/update`, []);
  const { mutateAsync: createMenu } = useAdminCustomPost<any, any>(`/menu/create`, []);

  const handleChangeMenuName = (e: ChangeEvent<HTMLInputElement>) => {
    const newMenu = {
      ...menu,
      title: e.target.value,
    };
    setMenu(newMenu);
  };
  const handleChangeLink = (e: string, menu: MenuUpdateReq) => {
    setMenu({ ...menu, link: e });
  };

  useEffect(() => {
    if (activeMenu) {
      setMenu({
        id: activeMenu?.id,
        title: activeMenu.title,
        link: activeMenu.link,
      });
    }
  }, [activeMenu]);

  const onSave = async () => {
    try {
      if (activeMenu) {
        await updateMenu(menu);
        notify.success("Update successfully", "Menu updated successfully");
      } else {
        await createMenu({ ...menu, parent_id: parentMenu?.id || params?.id });
        notify.success("Create successfully", "Menu created successfully");
      }
      reload();
      onClose();
    } catch (e) {
      notify.error("Error updating", "Menu updated error");
    }
  };

  const onClose = () => {
    setMenu({});
    close();
  };

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            {isUpdate ? "Edit a menu" : "Add new menu"}
          </h3>
          <Button variant="secondary" className="h-8 w-8 p-2" onClick={props.close}>
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />
        {!!parentMenu && (
          <div className="pt-6 px-6">
            <Text size="large">Create submenu for {parentMenu?.title}</Text>
          </div>
        )}

        {activeMenu && <div className="mt-[25px] px-6">{activeMenu?.title}</div>}

        <div className="flex-grow px-6">
          <InputField
            required
            label="title"
            type="string"
            name="title"
            value={menu?.title}
            className="my-6"
            placeholder={"Menu title"}
            onChange={handleChangeMenuName}
            autoFocus
          />

          <SearchLink data={menu} onClick={handleChangeLink} defaultValue={activeMenu?.link} />
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {/* === FOOTER === */}
        <div className="flex justify-end gap-2 p-3">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSave}>
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  );
}

export default AddEditMenuSideModal;
