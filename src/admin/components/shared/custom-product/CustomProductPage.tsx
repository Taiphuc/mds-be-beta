import { RouteProps } from "@medusajs/admin";
import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import { Pagination, Table } from "antd";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { columns } from "./column";
import { useNavigate } from "react-router-dom"
import { CustomProductBase } from "../../../../models/custom-product-base";
import CreateModal from "./createModal";
import ViewCustomProductBaseModal from "./ViewCustomProductBaseModal";
import { Button } from "@medusajs/ui";

type CustomProductPageProps = {} & RouteProps

const CustomProductPage: FC<CustomProductPageProps> = ({ notify }) => {
  const navigate = useNavigate()
  const [currentData, setCurrentData] = useState<CustomProductBase>()
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pageSize: 10
  })
  const { data, isLoading, refetch } = useAdminCustomQuery<any, any>(
    "/custom-product-base",
    [],
    {
      page: pagination.page,
      limit: pagination.pageSize
    }
  );
  const { mutate: mutateDelete } = useAdminCustomPost<any, any>(
    "/custom-product-base/delete",
    [],
  );

  const deleteOne = (data: CustomProductBase) => {
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
  
  useEffect(()=>{
    if(!isOpenCreate){
      refetch()
    }
  },[isOpenCreate])
  return (
    <BodyCard
      className="h-[1000px] overflow-auto"
      title="Custom Product base"
      subtitle="Manage custom product Base"
      footerMinHeight={40}
      setBorders
      actionables={[
        {
          label: 'Customer Created Product',
          onClick: () => {
            navigate('/a/custom-product/customer')
          }
        }
      ]}
    >
      <div className="py-3">
        <Button
          onClick={() => {
            setIsOpenCreate(true)
          }}
        >Create product base</Button>
      </div>
      {!isLoading && <>
        <Table<CustomProductBase>
          columns={columns({
            viewInfo: (data) => {
              setCurrentData(data); setIsOpen(true)
            },
            deleteOne: deleteOne,
          })}
          dataSource={data?.data}
          pagination={{
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page) => { setPagination({ ...pagination, page }) }
          }}
        />
      </>}

      {
        !!currentData && <ViewCustomProductBaseModal notify={notify} data={currentData} open={isOpen} onOpenChange={(data: boolean) => {
          setIsOpen(data);
          setCurrentData(null);
        }} setCurrentData={setCurrentData} />
      }
      {
        isOpenCreate &&
        <CreateModal open={isOpenCreate} onOpenChange={setIsOpenCreate} notify={notify} />
      }
    </BodyCard>)
}
export default CustomProductPage