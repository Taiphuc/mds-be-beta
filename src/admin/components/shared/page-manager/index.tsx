import { RouteProps } from "@medusajs/admin";
import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import { Table, useToggleState } from "@medusajs/ui";
import AddEditMenuSideModal from "./add-edit-pages";
import { Page } from "src/models/page";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import Spinner from "../spinner";
import { Trash } from "@medusajs/icons";
import EditIcon from "../icons/edit-icon";
import ConfirmModal from "../../modal/confirm-modal";

interface PageManagerProps extends RouteProps {}

const PageManager: FC<PageManagerProps> = ({ notify }) => {
  const { state: isEditModalVisible, open: showEditModal, close: hideEditModal } = useToggleState();
  const { state: isConfirmVisible, toggle: toggleConfirm } = useToggleState();
  const [activePage, setActivePage] = useState<Page | null>(null);
  const {
    data,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, { data: any[] }>("/pages", []);
  const pages = data?.data;
  const { mutate: deletePage } = useAdminCustomPost<any, any>(`/pages/delete`, []);
  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Title", key: "title", class: "" },
    { title: "Slug", key: "slug", class: "" },
    { title: "Action", key: "action", class: "w-[100px] text-center" },
  ];

  const handleDelete = (pageId: string) => {
    deletePage(
      { id: pageId },
      {
        onSuccess() {
          notify.success("Delete successfully", "page deleted successfully");
          refetchPages();
        },
        onError() {
          notify.error("Delete failed", "page deleted failed");
          refetchPages();
        },
      }
    );
  };

  useEffect(() => {
    !isConfirmVisible ? setActivePage(null) : "";
  }, [isConfirmVisible]);
  useEffect(() => {
    !isEditModalVisible ? setActivePage(null) : "";
  }, [isEditModalVisible]);

  return (
    <BodyCard
      className="h-full"
      title="Pages Manager"
      subtitle="Manage static pages of store"
      actionables={[
        {
          label: "Add Page",
          onClick: showEditModal,
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
            {pages[0]?.map((page: Page, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell className="w-[100px]">{i + 1}</Table.Cell>
                  <Table.Cell>{page?.title}</Table.Cell>
                  <Table.Cell>{page.link}</Table.Cell>
                  <Table.Cell className="flex gap-3 items-center justify-center w-[100px]">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setActivePage(page);
                        showEditModal();
                      }}
                    />
                    <Trash
                      className="cursor-pointer"
                      color="rgb(244 63 94)"
                      onClick={() => {
                        setActivePage(page);
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

      <ConfirmModal
        toggle={toggleConfirm}
        action={() => {
          handleDelete(activePage?.id);
        }}
        open={isConfirmVisible}
        okText="Delete"
        title={`Do you want to delete ${activePage?.title} page?`}
      />

      <AddEditMenuSideModal
        close={hideEditModal}
        activePage={activePage}
        isVisible={isEditModalVisible}
        notify={notify}
        reload={refetchPages}
      />
    </BodyCard>
  );
};
export default PageManager;
