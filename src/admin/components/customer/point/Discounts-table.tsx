import React, { useEffect, useState, useLayoutEffect } from "react";
import { useAdminCustomQuery, formatAmount } from "medusa-react";
import BodyCard from "../../shared/body-card";
import { Table, Toaster, useToast, StatusBadge } from "@medusajs/ui";
import Spinner from "../../shared/spinner";
import dayjs from "dayjs";
import Spacer from "../../shared/spacer";
import { CustomerDetailsWidgetProps } from "@medusajs/admin";
import NewDiscount from "../../discounts/new";
import { DiscountFormProvider } from "../../discounts/new/discount-form/form/discount-form-context";
import Fade from "../../atoms/fade-wrapper";
import DiscountForm from "../../discounts/new/discount-form";

export type DiscountRes = {
  id: string;
  code: string;
  rule: { value: number; description: string };
  regions: any;
  metadata: any;
  isDisabled: boolean;
  created_at: string;
};

type DiscountsRes = {
  data: DiscountRes[];
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

const DiscountsTable = (props: CustomerDetailsWidgetProps) => {
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
  } = useAdminCustomQuery<any, DiscountsRes>("/point/customer/discounts", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    customer_id: props?.customer?.id,
  });

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Code", key: "code", class: "w-[150px]" },
    { title: "Amount", key: "amount", class: "w-[150px]" },
    { title: "Description", key: "description", class: "" },
    { title: "status", key: "is_disable", class: "w-[100px]" },
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
    <BodyCard title="Customer point discounts" subtitle="Discount customer create from them points">
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
              {data?.data?.map((discount, i) => {
                return (
                  <Table.Row key={i} style={{ cursor: "pointer" }}>
                    <Table.Cell>{discount?.code}</Table.Cell>
                    <Table.Cell>
                      {formatAmount({
                        amount: discount?.rule?.value || 0,
                        region: discount?.regions[0],
                        includeTaxes: false,
                      })}
                    </Table.Cell>
                    <Table.Cell className="truncate max-w-[260px]">{discount?.rule?.description}</Table.Cell>
                    <Table.Cell>
                      {discount?.isDisabled && <StatusBadge>Disable</StatusBadge>}
                      {!discount?.isDisabled && <StatusBadge color="green">Active</StatusBadge>}
                    </Table.Cell>
                    <Table.Cell>{dayjs(discount.created_at).format("DD MMM YYYY HH:mm:ss")}</Table.Cell>
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

export default DiscountsTable;
