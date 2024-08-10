import {
  ChevronLeftMini,
  ChevronRightMini,
  Funnel,
  XMark,
} from "@medusajs/icons";
import { Product, ProductStatus, ProductVariant } from "@medusajs/medusa";
import { Button, FocusModal, IconButton, useToggleState } from "@medusajs/ui";
import type { TableColumnsType } from "antd";
import { Select, Spin, Table, TablePaginationConfig } from "antd";
import { useAdminCollections, useAdminProducts } from "medusa-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder";

type Props = {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  handleBulkDelete: ({ productIds }: { productIds: string[] }) => void;
};

const LIMIT = 10;

const status = ["published", "rejected", "proposed", "draft"];
type TParamsC = {
  offset: number;
  limit: number;
};
type TParams = TParamsC & {
  status: ProductStatus[];
  collection_id: string[];
};

const ModalBulkDelete = ({
  open,
  onClose,
  handleBulkDelete,
  isLoading: isLoadingBulkDelete,
}: Props) => {
  const baseParams = {
    limit: LIMIT,
    offset: 0,
    status: [],
    collection_id: [],
  };
  const [params, setParams] = useState<TParams>(baseParams);
  const onChangeTable = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...params,
      offset:
        ((pagination?.current || 1) - 1) * (pagination?.pageSize || LIMIT),
      limit: pagination?.pageSize || LIMIT,
    };
    setParams(newParams);
  };
  const { products, isLoading, isFetching, count } = useAdminProducts(params, {
    keepPreviousData: true,
    enabled: open,
  });

  const { state: isShowFilter, toggle: toggleShowFilter } = useToggleState();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      collection_id: [],
      status: [],
    },
  });

  const baseParamsC = { offset: 0, limit: 5 };
  const [paramsC, setParamsC] = useState<TParamsC>({
    ...baseParamsC,
  });
  const {
    collections,
    isLoading: isLoadingCollection,
    count: countC,
  } = useAdminCollections(paramsC, {
    keepPreviousData: true,
    enabled: open,
  });
  const handlePageChange = (direction: "next" | "previous") => {
    setParamsC((prevParams) => ({
      ...prevParams,
      offset:
        direction === "next"
          ? prevParams.offset + paramsC.limit
          : prevParams.offset - paramsC.limit,
    }));
  };

  const onSubmit = (data: TParams) => {
    setParams((prevParams) => ({
      ...prevParams,
      ...data,
    }));
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const columns: TableColumnsType<Product> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render(v: string, record: Product) {
        return (
          <div className="flex items-center">
            <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
              {record?.thumbnail ? (
                <img
                  src={record.thumbnail}
                  className="rounded-soft h-full object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            {v}
          </div>
        );
      },
    },
    {
      title: "Collection",
      dataIndex: "collection",
      key: "collection",
      render(v: { title: string }) {
        return <span className="inter-small-regular">{v?.title || "--"}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render(v: string) {
        const dotClass =
          (v === "published" && "bg-teal-50") ||
          (v === "rejected" && "bg-rose-50") ||
          (v === "proposed" && "bg-yellow-50") ||
          (v === "draft" && "bg-grey-40") ||
          "bg-grey-40";

        return (
          <div className="inter-small-regular flex items-center">
            <div
              className={`h-1.5 w-1.5 self-center rounded-full ${dotClass}`}
            />
            <span className="ml-2">{v}</span>
          </div>
        );
      },
    },
    {
      title: "Inventory quantity",
      dataIndex: "variants",
      key: "variants",
      render(v: ProductVariant[]) {
        const quantity = v.reduce(
          (acc, next) => acc + next?.inventory_quantity,
          0
        );
        return (
          <span className="inter-small-regular">
            {quantity} in stock for {v.length} variant(s)
          </span>
        );
      },
    },
  ];

  return (
    <FocusModal onOpenChange={onClose} open={open} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button
            disabled={selectedRowKeys.length === 0}
            isLoading={isLoadingBulkDelete}
            onClick={() =>
              handleBulkDelete({ productIds: selectedRowKeys as string[] })
            }
            variant="danger"
          >
            Delete
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="p-4 overflow-modal">
          <div className="flex flex-col gap-y-3">
            <div className="flex justify-between items-center">
              <div>
                {isShowFilter && (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex">
                    <div className="flex gap-x-3">
                      {collections && (
                        <div className="w-[200px]">
                          <Controller
                            name="collection_id"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                loading={isLoadingCollection}
                                showSearch={false}
                                getPopupContainer={(node) => node.parentNode}
                                mode="multiple"
                                placeholder="Select collections"
                                notFoundContent={
                                  isLoadingCollection ? (
                                    <Spin size="small" />
                                  ) : null
                                }
                                style={{ width: "100%" }}
                                dropdownRender={(menu) => (
                                  <>
                                    {menu}
                                    {countC > paramsC.limit && (
                                      <div className="flex gap-x-1 justify-end items-center">
                                        <IconButton
                                          variant="transparent"
                                          onClick={() =>
                                            handlePageChange("previous")
                                          }
                                          disabled={
                                            paramsC.offset === 0 ||
                                            isLoadingCollection
                                          }
                                        >
                                          <ChevronLeftMini />
                                        </IconButton>
                                        <IconButton
                                          variant="transparent"
                                          onClick={() =>
                                            handlePageChange("next")
                                          }
                                          disabled={
                                            paramsC.offset + paramsC.limit >=
                                              countC || isLoadingCollection
                                          }
                                        >
                                          <ChevronRightMini />
                                        </IconButton>
                                      </div>
                                    )}
                                  </>
                                )}
                              >
                                {collections.map((collection) => (
                                  <Select.Option
                                    key={collection.id}
                                    value={collection.id}
                                  >
                                    {collection.title}
                                  </Select.Option>
                                ))}
                              </Select>
                            )}
                          />
                        </div>
                      )}

                      <div className="w-[200px]">
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              showSearch={false}
                              getPopupContainer={(node) => node.parentNode}
                              mode="multiple"
                              placeholder="Select status"
                              style={{ width: "100%" }}
                            >
                              {status.map((v) => (
                                <Select.Option key={v} value={v}>
                                  {v}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>

                      <Button
                        disabled={!isDirty}
                        className="w-[100px] max-h-[32px]"
                        variant="transparent"
                        onClick={() => {
                          setParams({ ...baseParams });
                          reset();
                        }}
                      >
                        Clear all
                      </Button>
                      <Button
                        disabled={!isDirty}
                        className="w-[100px] max-h-[32px]"
                        variant="transparent"
                        type="submit"
                      >
                        Apply
                      </Button>
                    </div>
                  </form>
                )}
              </div>
              <IconButton onClick={toggleShowFilter}>
                {isShowFilter ? <XMark /> : <Funnel />}
              </IconButton>
            </div>

            <Table
              loading={isLoading || isFetching}
              onChange={onChangeTable}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
              }}
              className="ant-table-custom table-bulk-delete"
              columns={columns}
              rowKey="id"
              dataSource={products}
              pagination={{
                hideOnSinglePage: true,
                pageSize: params.limit,
                total: count,
                current: Math.floor(params.offset / params.limit) + 1,
                position: ["bottomCenter"],
                showSizeChanger: true,
              }}
            />
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};
export default ModalBulkDelete;
