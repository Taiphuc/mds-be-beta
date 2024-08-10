import { RouteProps } from "@medusajs/admin";
import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import { Table, useToggleState } from "@medusajs/ui";
import Spinner from "../spinner";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import EditIcon from "../icons/edit-icon";
import { SquareTwoStack, Trash } from "@medusajs/icons";
import { SizeGuide as SizeGuideType } from "src/models/size-guide";
import ConfirmModal from "../../modal/confirm-modal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import Badge from "../badge";

interface SizeGuideProps extends RouteProps {}

const SizeGuide: FC<SizeGuideProps> = ({ notify }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSizeGuide, setActiveSizeGuide] = useState<SizeGuideType | null>(null);
  const { state: isConfirmDeleteVisible, toggle: toggleConfirmDelete } = useToggleState();
  const { state: isConfirmDuplicateVisible, toggle: toggleConfirmDuplicate } = useToggleState();

  const { mutate: deleteSizeGuide } = useAdminCustomPost<any, any>(`/size-guide/delete`, []);
  const { mutate: duplicateSizeGuide } = useAdminCustomPost<any, any>(`/size-guide/duplicate`, []);

  const {
    data,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, { data: any[] }>("/size-guide", []);
  const sizeGuides = data?.data;

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Name", key: "name", class: "" },
    { title: "Status", key: "status", class: "w-[100px]" },
    { title: "Action", key: "action", class: "w-[150px] text-center" },
  ];

  const handleDelete = (id: number) => {
    deleteSizeGuide(
      { id },
      {
        onSuccess() {
          notify.success("Delete successfully", "Size guide deleted successfully");
          refetchPages();
        },
        onError() {
          notify.error("Delete failed", "Size guide deleted failed");
          refetchPages();
        },
      }
    );
  };

  const handleDuplicate = (id: number) => {
    duplicateSizeGuide(
      { id },
      {
        onSuccess() {
          notify.success("Duplicate successfully", "Size guide duplicated successfully");
          refetchPages();
        },
        onError() {
          notify.error("Duplicate failed", "Size guide duplicated failed");
          refetchPages();
        },
      }
    );
  };

  useEffect(() => {
    refetchPages();
  }, [location.key]);

  return (
    <BodyCard
      className="h-full"
      title="Size Guide"
      subtitle="Manage size guide"
      actionables={[
        {
          label: "Add Size Guide",
          onClick: () => navigate("/a/size-guide/new"),
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
            {sizeGuides?.map((size: SizeGuideType, i) => {
              return (
                <Table.Row key={i}>
                  <Table.Cell className="w-[100px]">{i + 1}</Table.Cell>
                  <Table.Cell>{size?.name}</Table.Cell>
                  <Table.Cell>{size?.status ? <Badge variant="success">Publish</Badge>: <Badge variant="warning">Draft</Badge>}</Table.Cell>
                  <Table.Cell className="flex gap-3 items-center justify-center w-[150px]">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => {
                        navigate("/a/size-guide/edit/" + size?.id);
                      }}
                    />
                    <SquareTwoStack
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveSizeGuide(size);
                        toggleConfirmDuplicate();
                      }}
                    />
                    <Trash
                      className="cursor-pointer"
                      color="rgb(244 63 94)"
                      onClick={() => {
                        setActiveSizeGuide(size);
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

      <ConfirmModal
        toggle={toggleConfirmDelete}
        action={() => {
          handleDelete(activeSizeGuide?.id);
        }}
        open={isConfirmDeleteVisible}
        okText="Delete"
        title={`Do you want to delete ${activeSizeGuide?.name} size guide?`}
      />
      <ConfirmModal
        toggle={toggleConfirmDuplicate}
        action={() => {
          handleDuplicate(activeSizeGuide?.id);
        }}
        open={isConfirmDuplicateVisible}
        okText="Duplicate"
        title={`Do you want to duplicate ${activeSizeGuide?.name} size guide?`}
      />

    </BodyCard>
  );
};
export default SizeGuide;
