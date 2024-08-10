import { CustomerDetailsWidgetProps } from "@medusajs/admin";
import { StatusBadge, Table, Toaster } from "@medusajs/ui";
import dayjs from "dayjs";
import {
  formatAmount,
  useAdminCustomPost,
  useAdminCustomQuery,
} from "medusa-react";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Fade from "../../atoms/fade-wrapper";
import DiscountForm from "../../discounts/new/discount-form";
import { DiscountFormProvider } from "../../discounts/new/discount-form/form/discount-form-context";
import useNotification from "../../hooks/use-notification";
import BodyCard from "../../shared/body-card";
import EditIcon from "../../shared/icons/edit-icon";
import MailIcon from "../../shared/icons/mail-icon";
import Spacer from "../../shared/spacer";
import Spinner from "../../shared/spinner";

export type DiscountRes = {
  id: string;
  code: string;
  rule: { value: number; description: string };
  regions: any;
  metadata: any;
  is_disabled: boolean;
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

const AdminDiscountsTable = (props: CustomerDetailsWidgetProps) => {
  const navigate = useNavigate();
  const notification = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 15,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data,
    refetch: refetchData,
    isLoading,
  } = useAdminCustomQuery<any, DiscountsRes>("/cus-customer/discounts", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
    customer_id: props?.customer?.id,
  });

  const { mutate: mutateSendmail, isLoading: isSendmailLoading } =
    useAdminCustomPost<{ discount_id: string }, any>(
      "/cus-customer/discounts-sendmail",
      []
    );

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Code", key: "code", class: "w-[150px]" },
    { title: "Amount", key: "amount", class: "w-[150px]" },
    { title: "Description", key: "description", class: "" },
    { title: "status", key: "is_disable", class: "w-[100px]" },
    { title: "Create time", key: "merchant_status", class: "w-[175px]" },
    { title: "actions", key: "actions", class: "w-[90px]" },
  ];

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

  const metadata = useMemo(() => {
    return [
      { key: "customer_id", value: props?.customer?.id },
      { key: "type", value: "admin_coupon" },
    ];
  }, [props?.customer?.id]);

  const handleSendMail = (discount_id: string) => {
    mutateSendmail(
      { discount_id },
      {
        onSuccess: () => {
          notification("Email sent", "Email send successfully", "success");
        },
        onError: () => {
          notification("Email sent failed", "Email send Failed", "error");
        },
      }
    );
  };

  const handleEdit = (id: string) => {
    navigate("/a/discounts/" + id);
  };

  useEffect(() => {
    refetchData();
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
    <BodyCard
      title="Customer Admin Create Coupons. ( Discounts)"
      actionables={[
        {
          label: "Add new coupon",
          onClick: () => {
            setIsOpen(true);
          },
        },
      ]}
    >
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
                    <Table.Cell className="truncate max-w-[260px]">
                      {discount?.rule?.description}
                    </Table.Cell>
                    <Table.Cell>
                      {discount?.is_disabled && (
                        <StatusBadge>Disable</StatusBadge>
                      )}
                      {!discount?.is_disabled && (
                        <StatusBadge color="green">Active</StatusBadge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {dayjs(discount.created_at).format(
                        "DD MMM YYYY HH:mm:ss"
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <MailIcon
                          onClick={() => {
                            handleSendMail(discount.id);
                          }}
                          className=""
                        />
                        <EditIcon
                          onClick={() => {
                            handleEdit(discount.id);
                          }}
                          className=""
                        />
                      </div>
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
        </>
      )}
      <DiscountFormProvider>
        <Fade isVisible={isOpen} isFullScreen={true}>
          <DiscountForm
            closeForm={() => {
              setIsOpen(false), refetchData();
            }}
            metadata={metadata}
          />
        </Fade>
      </DiscountFormProvider>
    </BodyCard>
  );
};

export default AdminDiscountsTable;
