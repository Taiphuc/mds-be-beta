import { RouteProps } from "@medusajs/admin";
import { FC, useState } from "react";
import BodyCard from "../body-card";
import { useNavigate } from "react-router-dom";
import Spinner from "../spinner";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Table, useToggleState } from "@medusajs/ui";
import { Theme as ThemeType } from "src/models/theme";
import Badge from "../badge";
import EditIcon from "../icons/edit-icon";
import { SquareTwoStack, Trash } from "@medusajs/icons";
import AddThemeModal from "./AddThemeModal";
import ConfirmModal from "../../modal/confirm-modal";

type ThemeProps = {} & RouteProps;

const Theme: FC<ThemeProps> = ({ notify }) => {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState<any>()
  const { state: isShowAddModal, close: closeAddModal, open: openAddModal} = useToggleState()
  const { state: isConfirmDeleteVisible, toggle: toggleConfirmDelete } = useToggleState();
  const { state: isConfirmDuplicateVisible, toggle: toggleConfirmDuplicate } = useToggleState();

  const { mutate: deleteTheme } = useAdminCustomPost<any, any>(`/theme/delete`, []);
  const { mutate: duplicateTheme } = useAdminCustomPost<any, any>(`/theme/duplicate`, []);

  const {
    data,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, { data: any[] }>("/theme", []);
  const themes = data?.data;

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Name", key: "name", class: "" },
    { title: "Status", key: "status", class: "w-[100px]" },
    { title: "Action", key: "action", class: "w-[150px] text-center" },
  ];

  const handleDelete = (id: number) => {
    deleteTheme(
      { id },
      {
        onSuccess() {
          notify.success("Delete successfully", "Theme deleted successfully");
          refetchPages();
        },
        onError() {
          notify.error("Delete failed", "Theme deleted failed");
          refetchPages();
        },
      }
    );
  };

  const handleDuplicate = (id: number) => {
    duplicateTheme(
      { id },
      {
        onSuccess() {
          notify.success("Duplicate successfully", "Theme duplicated successfully");
          refetchPages();
        },
        onError() {
          notify.error("Duplicate failed", "Theme duplicated failed");
          refetchPages();
        },
      }
    );
  };

  return (
    <BodyCard
      className="h-full"
      title="Theme"
      subtitle="Manage Theme"
      actionables={[
        {
          label: "Add Theme",
          onClick: openAddModal,
        },
      ]}
      footerMinHeight={40}
      setBorders
    >
      {isLoadingPages ? (
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
            {themes?.map((theme: ThemeType, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell className="w-[100px]">{i + 1}</Table.Cell>
                  <Table.Cell>{theme?.name}</Table.Cell>
                  <Table.Cell>
                    {theme?.status ? <Badge variant="success">Publish</Badge> : <Badge variant="warning">Draft</Badge>}
                  </Table.Cell>
                  <Table.Cell className="flex gap-3 items-center justify-center w-[150px]">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => {
                        navigate("/a/theme/edit/" + theme?.id);
                      }}
                    />
                    <SquareTwoStack
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveTheme(theme);
                        toggleConfirmDuplicate();
                      }}
                    />
                    <Trash
                      className="cursor-pointer"
                      color="rgb(244 63 94)"
                      onClick={() => {
                        setActiveTheme(theme);
                        toggleConfirmDelete();
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
      <AddThemeModal open={isShowAddModal} onClose={closeAddModal} notify={notify} reload={refetchPages}/>

      <ConfirmModal
        toggle={toggleConfirmDelete}
        action={() => {
          handleDelete(activeTheme?.id);
        }}
        open={isConfirmDeleteVisible}
        okText="Delete"
        title={`Do you want to delete ${activeTheme?.name} theme?`}
      />
      <ConfirmModal
        toggle={toggleConfirmDuplicate}
        action={() => {
          handleDuplicate(activeTheme?.id);
        }}
        open={isConfirmDuplicateVisible}
        okText="Duplicate"
        title={`Do you want to duplicate ${activeTheme?.name} theme?`}
      />
    </BodyCard>
  );
};
export default Theme;
