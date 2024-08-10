import React, { useContext } from "react";
import clsx from "clsx";
import { ProductCategory } from "@medusajs/medusa";
import { useAdminCustomPost } from "medusa-react";
import { useTranslation } from "react-i18next";
import { MenuContext } from "./menu-page";
import { RouteProps } from "@medusajs/admin";
import TrashIcon from "../icons/trash-icon";
import EditIcon from "../icons/edit-icon";
import { Menu } from "src/models/menu";
import FolderOpenIcon from "../icons/folder-open-icon";
import TagIcon from "../icons/tag-icon";
import { Tooltip, useToggleState } from "@medusajs/ui";
import Button from "../button";
import PlusIcon from "../icons/plus-icon";
import Actionables, { ActionType } from "../actionables";
import MoreHorizontalIcon from "../icons/more-horizontal-icon";
import EyeOffIcon from "../icons/eye-off-icon";
import ConfirmModal from "../../modal/confirm-modal";

interface MenuListItemDetailsProps extends RouteProps {
  depth: number;
  item: Menu;
  handler: React.ReactNode;
  collapseIcon: React.ReactNode;
  reload?: () => void;
}

function MenuListItemDetails(props: MenuListItemDetailsProps) {
  const { item, notify, reload } = props;
  const { t } = useTranslation();
  const hasChildren = !!item.children?.length;
  const MenuPageContext = useContext(MenuContext);
  const { mutateAsync: deleteMenu } = useAdminCustomPost<any, any>(`/menu/delete`, []);

  const actions = [
    {
      label: t("components-edit", "Edit"),
      onClick: () => MenuPageContext.editMenu(item),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: async () => {
        try {
          await deleteMenu({ id: item?.id });
          reload?.();
          notify.success("Delete Success", "Deleted successfully!");
        } catch (e) {
          notify.success("Delete Failed", "Deleted Failed!");
        }
      },
      icon: <TrashIcon size={20} />,
      disabled: !!item?.children?.length,
    },
  ];

  return (
    <div className="bg-white">
      <div style={{ marginLeft: props.depth * -8 }} className="flex h-[40px] items-center">
        <div className="flex w-[32px] items-center justify-center">{props.handler}</div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {hasChildren && (
              <div className="absolute flex w-[20px] cursor-pointer items-center justify-center">
                {props.collapseIcon}
              </div>
            )}
            <div className="ml-[20px] flex w-[32px] items-center justify-center">
              {hasChildren && <FolderOpenIcon color="#889096" size={18} />}
              {!hasChildren && <TagIcon color="#889096" size={18} />}
            </div>
            <span
              className={clsx("ml-2 select-none text-xs font-medium", {
                "font-normal text-gray-400": !hasChildren,
              })}
            >
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip
              style={{ zIndex: 1 }}
              content={
                <>
                  {"Add menu item to"}
                  <span className="text-grey-80 font-semibold">{`"${item.title}"`}</span>
                </>
              }
            >
              <Button size="small" variant="ghost" onClick={() => MenuPageContext.createSubMenu(item)}>
                <PlusIcon color="#687076" size={18} />
              </Button>
            </Tooltip>
            <Actionables
              forceDropdown
              actions={actions as ActionType[]}
              customTrigger={
                <Button
                  size="small"
                  variant="ghost"
                  className="h-xlarge w-xlarge focus-visible:border-violet-60 focus-visible:shadow-input focus:shadow-none focus-visible:outline-none"
                >
                  <MoreHorizontalIcon color="#687076" size={20} />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuListItemDetails;
