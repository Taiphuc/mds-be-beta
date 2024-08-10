import { RouteProps } from "@medusajs/admin";
import { FC, useState, useEffect } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Table, useToggleState } from "@medusajs/ui";
import BodyCard from "../body-card";
import Spinner from "../spinner";
import EditIcon from "../icons/edit-icon";
import TrashIcon from "../icons/trash-icon";
import ConfirmModal from "../../modal/confirm-modal";
import AddGroupMenu from "./add-group-menu";
import { useNavigate } from "react-router-dom";

type GroupMenuType = {
  id: string;
  title: string;
  listMenu: string;
  slug: string;
};

const MenuGroup: FC<RouteProps> = ({ notify }) => {
  const { state: isEditModalVisible, open: showEditModal, close: hideEditModal } = useToggleState();
  const { state: isAddModalVisible, open: openAddModal, close: closeAddModal } = useToggleState();
  const { state: isConfirmVisible, toggle: toggleConfirm } = useToggleState();
  const [group, setActiveGroup] = useState<GroupMenuType | null>(null);
  const navigate = useNavigate();

  const {
    data: dataGroup,
    isLoading: isLoadingGroup,
    refetch: refetchGroup,
  } = useAdminCustomQuery<{ type: string }, { data: GroupMenuType[] }>("/menu", [], {
    type: "MAIN_MENU",
  });
  const { mutate: deletePage } = useAdminCustomPost<any, any>(`/menu/delete`, []);

  const groups = dataGroup?.data;

  const handleDelete = (groupId: string) => {
    deletePage(
      { id: groupId },
      {
        onSuccess() {
          notify.success("Delete successfully", "page deleted successfully");
          refetchGroup();
        },
        onError() {
          notify.error("Delete failed", "page deleted failed");
          refetchGroup();
        },
      }
    );
  };

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Title", key: "title", class: "" },
    { title: "Menu items", key: "items", class: "" },
    { title: "Action", key: "action", class: "w-[100px] text-center" },
  ];

  useEffect(() => {
    if (!isEditModalVisible) {
      setActiveGroup(null);
    }
  }, [isEditModalVisible]);
  useEffect(() => {
    refetchGroup();
  }, []);

  return (
    <BodyCard
      className="h-full"
      title="Menu Groups"
      subtitle="Manage groups of menu"
      actionables={[
        {
          label: "Add Menu Group",
          onClick: openAddModal,
        },
      ]}
      footerMinHeight={40}
      setBorders
    >
      {isLoadingGroup ? (
        <div className="w-full flex items-center justify-center h-56">
          <Spinner />
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              {columns.map((e) => (
                <Table.HeaderCell key={e.key} className={e.class}>
                  {e.title}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groups?.map((group: GroupMenuType, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell className="w-[100px]">{i + 1}</Table.Cell>
                  <Table.Cell>{group?.title}</Table.Cell>
                  <Table.Cell>
                    <div className="truncate max-w-[500px]" title={group?.listMenu}>
                      {group?.listMenu}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="flex gap-3 items-center justify-center w-[100px]">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(group?.id + "?name=" + group?.title);
                      }}
                    />
                    <TrashIcon
                      className="cursor-pointer"
                      color="rgb(244 63 94)"
                      onClick={() => {
                        setActiveGroup(group);
                        toggleConfirm();
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}

      <AddGroupMenu
        isOpen={isAddModalVisible}
        reload={refetchGroup}
        open={openAddModal}
        close={closeAddModal}
        notify={notify}
      />

      <ConfirmModal
        toggle={toggleConfirm}
        action={() => {
          handleDelete(group?.id);
        }}
        open={isConfirmVisible}
        okText="Delete"
        title={`Do you want to delete ${group?.title} group?`}
      />
    </BodyCard>
  );
};
export default MenuGroup;
