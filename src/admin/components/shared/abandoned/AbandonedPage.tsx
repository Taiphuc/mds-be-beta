import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import { Table, useToggleState } from "@medusajs/ui";
import { useAdminCustomQuery } from "medusa-react";
import Spinner from "../spinner";
import EditIcon from "../icons/edit-icon";
import dayjs from "dayjs";
import EditAbandoned from "./EditAbandoned";
import { RouteProps } from "@medusajs/admin";
import { useNavigate } from "react-router-dom";

type PaginationType = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
};

type AbandonedPageProps = {} & RouteProps;

const AbandonedPage: FC<AbandonedPageProps> = ({ notify }) => {
  const { state: isOpen, close, open } = useToggleState(false);
  const router = useNavigate();
  const [currentCart, setCurrentCart] = useState<any>();
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 15,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, { data: any }>("/abandoned", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });
  const abandonedList = data?.data;

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Email", key: "email", class: "" },
    { title: "Created at", key: "created_at", class: "" },
    { title: "Updated at", key: "updated_at", class: "" },
    { title: "Action", key: "action", class: "w-[150px] text-center" },
  ];

  const handleNextPage = () => {
    const page = pagination?.pageIndex + 1 > pagination?.pageCount ? pagination?.pageCount : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const onClose = () => {
    setCurrentCart(undefined);
    close();
  };

  useEffect(() => {
    if (abandonedList?.total) {
      setPagination({
        ...pagination,
        count: abandonedList?.total,
        pageIndex: abandonedList?.page,
        pageCount: Math.ceil(abandonedList?.total / pagination.pageSize),
      });
    }
  }, [abandonedList]);

  useEffect(() => {
    refetchPages();
  }, [pagination?.pageIndex]);

  return (
    <BodyCard
      className="h-[800px]"
      title="Abandoned List"
      subtitle="Manage Abandoned Carts"
      actionables={[
        {
          label: "Go to segment settings",
          onClick: () => {
            router("/a/settings/segment");
          },
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
        <div className="h-full overflow-auto">
          <Table className="h-full">
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
              {abandonedList?.data?.map((abandoned: any, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell className="w-[100px]">{i + 1}</Table.Cell>
                    <Table.Cell>{abandoned?.email}</Table.Cell>
                    <Table.Cell>{dayjs(abandoned?.created_at).format("HH:mm DD/MM/YYYY")}</Table.Cell>
                    <Table.Cell>{dayjs(abandoned?.updated_at).format("HH:mm DD/MM/YYYY")}</Table.Cell>
                    <Table.Cell className="flex gap-3 items-center justify-center w-[150px]">
                      <EditIcon
                        className="cursor-pointer"
                        onClick={() => {
                          setCurrentCart(abandoned);
                          open();
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Table.Pagination
            canNextPage
            canPreviousPage
            count={pagination.count}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex - 1}
            pageCount={pagination.pageCount}
            nextPage={handleNextPage}
            previousPage={handlePrePage}
          />
        </div>
      )}
      {isOpen && (
        <EditAbandoned
          close={onClose}
          isOpen={isOpen}
          notify={notify}
          open={open}
          reload={refetchPages}
          cart={currentCart}
        />
      )}
    </BodyCard>
  );
};
export default AbandonedPage;
