import { Button } from "@medusajs/ui";
import { Form, Input, List, Skeleton } from "antd";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useState } from "react";
import { SETTING_TYPES } from "../../../../types/settings";
import ShippingTypesModal from "./ShippingTypeModal";
import ShippingProductModal from "./ShippingProductModal";

const list = [
  {
    id: "product type",
    title: "Product type",
  },
  {
    id: "product",
    title: "Product",
  },
];

export type ShippingSettingsRes = {
  default_shipping_time: {
    value: string;
    id: number;
  };
  default_process_time: {
    value: string;
    id: string;
  };
};

export default function EstimateShipping({ notify }) {
  const [isOpenShippingProduct, setIsOpenShippingProduct] = useState(false);
  const [isOpenShippingTypes, setIsOpenShippingTypes] = useState(false);

  const {
    data: shippingSetting,
    isLoading: isLoadingShippingSetting,
    refetch: refetchShippingSetting,
  } = useAdminCustomQuery<{ type: string }, { shipping: ShippingSettingsRes }>(
    "/settings",
    [],
    {
      type: SETTING_TYPES.shipping,
    }
  );
  const { mutate: updateSettings, isLoading: isLoadingUpdate } =
    useAdminCustomPost<any, any>(`/settings/update`, []);

  const handleUpdateDefault = (values: {
    shipping: string;
    process: string;
  }) => {
    if (!shippingSetting) return;
    const { default_shipping_time, default_process_time } =
      shippingSetting.shipping;
    default_shipping_time.value = values.shipping;
    default_process_time.value = values.process;
    updateSettings([default_shipping_time, default_process_time], {
      onSuccess() {
        refetchShippingSetting();
        notify.success("Update success", "Update successfully");
      },
      onError() {
        notify.error("Update failed", "Please try again");
      },
    });
  };

  return (
    <>
      <Skeleton
        className="mt-3"
        paragraph={{ rows: 1 }}
        loading={isLoadingShippingSetting}
        active
        title={false}
      >
        {!isLoadingShippingSetting && (
          <Form
            onFinish={handleUpdateDefault}
            className="flex justify-between mt-3"
          >
            <div className="flex flex-col gap-y-3">
              <Form.Item
                name="shipping"
                initialValue={
                  shippingSetting.shipping?.default_shipping_time?.value
                }
                label="Default shipping time:"
              >
                <Input placeholder="2-7" addonAfter={<span>Days</span>} />
              </Form.Item>
              <Form.Item
                name="process"
                initialValue={
                  shippingSetting.shipping?.default_process_time?.value
                }
                label="Default process time:"
              >
                <Input placeholder="2-7" addonAfter={<span>Days</span>} />
              </Form.Item>
            </div>
            <Button
              type="submit"
              isLoading={isLoadingUpdate}
              className="h-[32px]"
              variant="primary"
            >
              Update
            </Button>
          </Form>
        )}
      </Skeleton>

      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a
                onClick={() => {
                  if (item.id === "product") setIsOpenShippingProduct(true);
                  if (item.id === "product type") setIsOpenShippingTypes(true);
                }}
                key="list-loadmore-edit"
              >
                edit
              </a>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={`Set default shipping for ${item.id}`}
            />
          </List.Item>
        )}
      />
      <ShippingProductModal
        notify={notify}
        open={isOpenShippingProduct}
        onClose={() => setIsOpenShippingProduct(false)}
      />
      <ShippingTypesModal
        notify={notify}
        open={isOpenShippingTypes}
        onClose={() => setIsOpenShippingTypes(false)}
      />
    </>
  );
}
