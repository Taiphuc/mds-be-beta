import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import { Table } from "antd";
import { RouteProps } from "@medusajs/admin";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { useNavigate } from "react-router-dom"
import { CustomProduct } from "../../../../models/custom-product";
import { CustomerColumn } from "./customerColumn";
import CreateCustomProductBase from "./design/test1";
import Design1Provider from "./design/Provider";

type CustomerCustomProductProps = {} & RouteProps;

const CustomerCustomProduct: FC<CustomerCustomProductProps> = ({ notify }) => {
  const navigate = useNavigate()
  const [currentData, setCurrentData] = useState<CustomProduct>()
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const { data, isLoading, refetch } = useAdminCustomQuery<any, any>(
    "/custom-product",
    [],
    {
      page: pagination.page,
      limit: pagination.pageSize
    }
  );
  const { mutate: mutateDelete } = useAdminCustomPost<any, any>(
    "/custom-product/delete",
    [],
  );

  const deleteOne = (data: CustomProduct) => {
    mutateDelete({ productId: data?.id }, {
      onSuccess: () => {
        notify.success('Delete Success', "Deleted successfully!");
        refetch();
      },
      onError: () => {
        notify.success('Delete Failed', "Delete failed!")
      },
    })
  }

  useEffect(() => {
    setPagination({ ...pagination, page: data?.page, total: data?.total });
  }, [data?.page])

  return (<BodyCard
    className="h-[1000px] overflow-auto"
    title="Customer Custom Product"
    subtitle="Manage customer custom product"
    footerMinHeight={40}
    setBorders
  >
    {!isLoading && <>
      <Table<CustomProduct>
        columns={CustomerColumn({
          deleteOne: deleteOne
        })}
        dataSource={data?.data}
        pagination={{
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => { setPagination({ ...pagination, page }) }
        }} />
    </>}
  </BodyCard>)
}

export default CustomerCustomProduct