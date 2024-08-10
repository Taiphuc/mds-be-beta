import { Table } from "@medusajs/ui";
import { Skeleton } from "antd";
import { useAdminCustomQuery } from "medusa-react";
import { useState, useEffect } from "react";
import { ApiResponse, QueryParams } from "src/admin/types/utils";
import { TOptionPageItem } from "../../../../types/dto/optionPage";
import PaginationTable from "../../../types/pagination-table";
import { Notify } from "../../types/extensions";
import BodyCard from "../body-card";
import EditIcon from "../icons/edit-icon";
import { useNavigate } from "react-router-dom";

type TOptionPage = {
  notify: Notify;
};

export default function OptionPage({ notify }: TOptionPage) {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationTable>({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
  });
  const handleNextPage = () => {
    const page =
      pagination?.pageIndex + 1 > pagination?.pageCount
        ? pagination?.pageCount
        : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const { data, isLoading: isLoadingOptionPage } = useAdminCustomQuery<
    QueryParams,
    ApiResponse<{ count: number; option_pages: TOptionPageItem[] }>
  >("/option-page", [], {
    offset: (pagination.pageIndex - 1) * pagination.pageSize,
    limit: pagination.pageSize,
  });
  useEffect(() => {
    if (data?.data?.count) {
      setPagination({ ...pagination, count: data.data.count });
    }
  }, [data]);

  return (
    <BodyCard
      className="h-full"
      title="Option page"
      subtitle="Manage option page"
      footerMinHeight={40}
      setBorders
    >
      <Skeleton className="mt-3" loading={isLoadingOptionPage} active title={false}>
        {!isLoadingOptionPage && (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Key</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.data.option_pages.map((option) => (
                <Table.Row key={option.id}>
                  <Table.Cell className="w-[90%]">{option.key}</Table.Cell>
                  <Table.Cell>
                    <EditIcon
                      onClick={() => navigate("/a/option-page/" + option.key)}
                      className="cursor-pointer"
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            {pagination.pageSize < pagination.count && (
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
            )}
          </Table>
        )}
      </Skeleton>
    </BodyCard>
  );
}
