import React, { useEffect, useState, useLayoutEffect } from "react";
import { useAdminCustomQuery } from "medusa-react";
import BodyCard from "../../../components/shared/body-card";
import { Table, Toaster, useToast } from "@medusajs/ui";
import Spinner from "../../../components/shared/spinner";
import dayjs from "dayjs";
import Spacer from "../../shared/spacer";
import { CustomerDetailsWidgetProps } from "@medusajs/admin";

export type PointRes = {
  id: string;
  point: number;
  type: string;
  message: string;
  metadata: any;
  customerId: string;
  created_at: string;
};

type PointsRes = {
  data: PointRes[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

type PaginationType = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
};

export type UpdateActiveReq = {
  id: string;
  active: boolean;
};

const PointsTable = (props: CustomerDetailsWidgetProps) => {
  const { toast } = useToast();
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 15,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data,
    refetch: refetchReview,
    isLoading,
    isFetching,
  } = useAdminCustomQuery<any, PointsRes>("/point/customer/points", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    customer_id: props?.customer?.id
  });

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Num.", key: "index", class: "w-[100px]" },
    { title: "Point", key: "point", class: "w-[150px]" },
    { title: "message", key: "message", class: "" },
    { title: "Create time", key: "merchant_status", class: "w-[175px]" },
  ];

  const handleNextPage = () => {
    const page = pagination?.pageIndex + 1 > pagination?.pageCount ? pagination?.pageCount : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };
  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  useEffect(() => {
    refetchReview();
  }, [pagination?.pageIndex]);

  useEffect(() => {
    if (data?.total) {
      setPagination({
        ...pagination,
        count: data?.total,
        pageIndex: data?.page,
        pageCount: Math.ceil(data?.total / pagination.pageSize),
      });
    }
  }, [data]);

  useLayoutEffect(() => {
    if (document) {
      const main = document.querySelector("main.h-full");
      main?.classList?.remove("h-full");
    }
  }, []);

  return (
    <BodyCard title="Customer points used history.">
      <Toaster />
      <Spacer />
      {isLoading ? (
        <div className="flex items-center justify-center bg-white bg-opacity-50 w-full min-h-[400px]">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <>
          <Table className="m-h-[800px]">
            <Table.Header>
              <Table.Row>
                {columns?.map((e) => (
                  <Table.HeaderCell key={e.key} className={e.class}>
                    {e.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data?.map((point, i) => {
                return (
                  <Table.Row key={i} style={{ cursor: "pointer" }}>
                    <Table.Cell>{i + 1}</Table.Cell>
                    <Table.Cell>{point?.point}</Table.Cell>
                    <Table.Cell className="truncate max-w-[260px]">{point?.message}</Table.Cell>
                    <Table.Cell>{dayjs(point.created_at).format("DD MMM YYYY HH:mm:ss")}</Table.Cell>
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
        </>
      )}
    </BodyCard>
  );
};

export default PointsTable;
