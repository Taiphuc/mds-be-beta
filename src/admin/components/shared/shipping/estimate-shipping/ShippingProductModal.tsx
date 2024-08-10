import { RouteProps } from "@medusajs/admin";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import { Button } from "@medusajs/ui";
import { Modal, TablePaginationConfig } from "antd";
import { useAdminProducts } from "medusa-react";
import { FC, useEffect, useState } from "react";
import EditableTable, {
  ETypeEdit,
} from "../../../../components/editable-table";
import { medusaClient } from "../../../../constants/constant";
import { getErrorMessage } from "../../../utils/error-messages";

type ShippingProductModalProps = {
  open: boolean;
  onClose: () => void;
} & RouteProps;

type TProductEdit = PricedProduct & {
  estimate_shipping: string;
  process_time: string;
};
type TUpdateProduct = {
  id: string;
  estimate_shipping: string;
  process_time: string;
};

const ShippingProductModal: FC<ShippingProductModalProps> = ({
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

  const {
    products,
    isLoading: isLoadingProducts,
    count,
  } = useAdminProducts(params, { keepPreviousData: true });

  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    if (products)
      setDataSource(
        products.map((product) => ({
          ...product,
          estimate_shipping: product.metadata?.estimate_shipping || "",
          process_time: product.metadata?.process_time || "",
        }))
      );
  }, [products]);
  const [loading, setLoading] = useState(new Set<string>());
  const handleUpdate = async ({
    id,
    estimate_shipping,
    process_time,
  }: TUpdateProduct) => {
    try {
      setLoading((prevLoading) => new Set(prevLoading).add(id));
      const estimatePromise = () =>
        medusaClient.admin.products.setMetadata(id, {
          key: "estimate_shipping",
          value: estimate_shipping,
        });
      const processPromise = () =>
        medusaClient.admin.products.setMetadata(id, {
          key: "process_time",
          value: process_time,
        });
      await Promise.all([estimatePromise, processPromise].map((fn) => fn()));
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
      title: "title",
      dataIndex: "title",
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
      render: (_: any, record: TProductEdit) => {
        const currProduct: any = products?.find((prd) => prd.id === record.id);
        return (
          <Button
            isLoading={loading.has(record.id)}
            disabled={
              record.process_time ===
                (currProduct?.metadata?.process_time || "") &&
              record.estimate_shipping ===
                (currProduct?.metadata?.estimate_shipping || "")
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
          loading: isLoadingProducts,
        }}
        toggleEditable
      />
    </Modal>
  );
};
export default ShippingProductModal;
