import { RouteProps } from "@medusajs/admin";
import { FC, useMemo, useCallback, useState } from "react";
import Nestable from "react-nestable";
import { useAdminCustomPost } from "medusa-react";
import { Menu } from "../../../../models/menu";
import ReorderIcon from "../icons/reorder-icon";
import { dropRight, flatMap, get } from "lodash";
import MenuListItemDetails from "./menu-list-item-details";
import TriangleDownIcon from "../icons/triangle-mini-icon";
import { useParams } from "react-router-dom";

interface MenuListProps extends RouteProps {
  menu: Menu[];
  refetch: () => void;
}

const MenuList: FC<MenuListProps> = ({ notify, menu, refetch }) => {
  const { mutate: updateMenu } = useAdminCustomPost<any, any>(`/menu/update`, []);
  const params = useParams();
  const onItemDrop = useCallback(async (p) => {
    const { items, targetPath } = p;
    let updateData;
    if (targetPath.length > 1) {
      const path = dropRight(flatMap(targetPath?.slice(0, -1), (item) => [item, "children"]));
      const newParent = get(items, path);
      updateData = newParent?.children?.map((c, i) => ({ order: i, id: c?.id, parent_id: newParent?.id || null }));
    } else {
      updateData = items?.map((c, i) => ({ order: i, id: c?.id, parent_id: params?.id }));
    }
    try {
      updateMenu(updateData);
      notify.success("Update successfully", "Menu updated successfully");
    } catch (e) {
      notify.error("Error updating", "Menu updated error");
    }
  }, []);

  const NestableList = useMemo(
    () => (
      <Nestable
        items={menu}
        collapsed={true}
        onChange={(params) => {
          onItemDrop(params);
        }}
        childrenProp="children"
        // Adding an unreasonably high number here to prevent us from
        // setting a hard limit  on category depth. This should be decided upon
        // by consumers of medusa after considering the pros and cons to the approach
        maxDepth={99}
        renderItem={({ item, depth, handler, collapseIcon }) => (
          <MenuListItemDetails
            item={item as Menu}
            depth={depth}
            handler={handler}
            collapseIcon={collapseIcon}
            notify={notify}
            reload={refetch}
          />
        )}
        handler={<ReorderIcon className="cursor-grab" color="#889096" />}
        renderCollapseIcon={({ isCollapsed }) => (
          <TriangleDownIcon
            style={{
              top: -2,
              width: 32,
              left: -12,
              transform: !isCollapsed ? "" : "rotate(270deg)",
            }}
            color="#889096"
          />
        )}
      />
    ),
    [menu]
  );

  return <div>{NestableList}</div>;
};
export default MenuList;
