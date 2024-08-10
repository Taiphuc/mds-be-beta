import { RouteProps } from "@medusajs/admin";
import { ProductType } from "@medusajs/medusa";
import { Button } from "@medusajs/ui";
import { Modal, TablePaginationConfig } from "antd";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { FC, useEffect, useState } from "react";
import EditableTable, {
  ETypeEdit,
} from "../../../editable-table";
import { getErrorMessage } from "../../../utils/error-messages";

type ShippingTypesModalProps = {
  open: boolean;
  onClose: () => void;
} & RouteProps;
type TUpdateProduct = {
  id: string;
  estimate_shipping: string;
  process_time: string;
};
type TProducTypeShipping = ProductType & {
  estimate_shipping: string;
  process_time: string;
};

const ShippingTypesModal: FC<ShippingTypesModalProps> = ({
  notify,
  open,
  onClose,
}) => {
  const baseParams = { offset: 0, limit: 10 };
  const [params, setParams] = useState<{ offset: number; limit: number }>({
    ...baseParams,
  });
  const onChangeTable = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...params,
      offset:
        ((pagination?.current || 1) - 1) *
        (pagination?.pageSize || baseParams.offset),
      limit: pagination?.pageSize || baseParams.limit,
    };
    setParams(newParams);
  };

  const { data: fetchProductTypes, isLoading: isLoadingTypes } =
    useAdminCustomQuery("/product-type-v2", ["list-product-type"], params);
  const [dataSource, setDataSource] = useState<TProducTypeShipping[]>([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (fetchProductTypes) {
      setDataSource(
        fetchProductTypes.data.product_types.map((types: ProductType) => ({
          ...types,
          estimate_shipping: types.metadata?.estimate_shipping || "",
          process_time: types.metadata?.process_time || "",
        }))
      );
      setCount(fetchProductTypes.data.count);
    }
  }, [fetchProductTypes]);
  const { mutateAsync: mutateAsyncUpdateTypes } = useAdminCustomPost<
    { types: any },
    any
  >("/product-type-v2/update", ["update-product-type"]);

  const [loading, setLoading] = useState(new Set<string>());
  const handleUpdate = async ({
    id,
    estimate_shipping,
    process_time,
  }: TUpdateProduct) => {
    try {
      setLoading((prevLoading) => new Set(prevLoading).add(id));
      const estimatePromise = {
        typeId: id,
        key: "estimate_shipping",
        value: estimate_shipping,
      };
      const processPromise = {
        typeId: id,
        key: "process_time",
        value: process_time,
      };

      await Promise.all(
        [
          () => mutateAsyncUpdateTypes({ types: [estimatePromise] }),
          () => mutateAsyncUpdateTypes({ types: [processPromise] }),
        ].map((fn) => fn())
      );
      notify.success("Success", "Update default shipping success");
    } catch (error) {
      notify.error("Error:", getErrorMessage(error));
    } finally {
      setLoading((prevLoading) => {
        const newLoading = new Set(prevLoading);
        newLoading.delete(id);
        return newLoading;
      });
    }
  };

  const defaultColumns = [
    {
      title: "Title",
      dataIndex: "value",
      width: 400,
    },
    {
      title: "Estimate shipping",
      dataIndex: "estimate_shipping",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "Process time",
      dataIndex: "process_time",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: TProducTypeShipping) => {
        const currType: any = fetchProductTypes?.data?.product_types?.find(
          (prd: TProducTypeShipping) => prd.id === record.id
        );
        return (
          <Button
            isLoading={loading.has(record.id)}
            disabled={
              record.process_time ===
                (currType?.metadata?.process_time || "") &&
              record.estimate_shipping ===
                (currType?.metadata?.estimate_shipping || "")
            }
            variant="secondary"
            onClick={() =>
              handleUpdate({
                id: record.id,
                estimate_shipping: record.estimate_shipping,
                process_time: record.process_time,
              })
            }
          >
            Save
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      width={1200}
      open={open}
      title="Set default shipping for default"
      okText="Done"
      footer={null}
      onCancel={onClose}
    >
      <EditableTable
        rowKey="id"
        defaultColumns={defaultColumns}
        dataSource={dataSource}
        setDataSource={setDataSource}
        tableProps={{
          pagination: {
            hideOnSinglePage: true,
            pageSize: params.limit,
            total: count,
            current: Math.floor(params.offset / params.limit) + 1,
            position: ["bottomCenter"],
          },
          onChange: onChangeTable,
          loading: isLoadingTypes,
        }}
        toggleEditable
      />
    </Modal>
  );
};
export default ShippingTypesModal;
