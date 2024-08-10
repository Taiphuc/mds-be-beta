import { Text } from "@medusajs/ui";
import { Checkbox, Descriptions, Image, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ProductVariantWithKey } from "../bulk-edit-variant";

export type THandleViewVariantModal = {
  onOpen: (x: boolean, variant: ProductVariantWithKey) => void;
};

export type TViewVariantModal = {};

const ViewVariantModal = forwardRef(({}: TViewVariantModal, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<ProductVariantWithKey>();

  useImperativeHandle(
    ref,
    () => ({
      onOpen: (x: boolean, variant: ProductVariantWithKey) => {
        setIsOpen(x);
        setVariant(variant);
      },
    }),
    []
  );

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      width={700}
      open={isOpen}
      title={variant?.title}
      onCancel={onClose}
      onOk={onClose}
      okButtonProps={{ size: "small", type: "default", danger: true }}
      cancelButtonProps={{ size: "small" }}
      forceRender
      okText="Done"
    >
      {variant && (
        <>
          <Descriptions
            column={1}
            className="mt-6 fixed-labels"
            title="General"
            bordered
          >
            <Descriptions.Item label="Title">{variant.title}</Descriptions.Item>
            <Descriptions.Item label="Material">
              {variant?.material || "--"}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            column={1}
            className="mt-6 fixed-labels"
            title="Stock & Inventory"
            bordered
          >
            <Descriptions.Item label="SKU">
              {variant?.sku || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {variant?.inventory_quantity || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="EAN">
              {variant?.ean || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="UPC">
              {variant?.upc || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Barcode">
              {variant?.barcode || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Manage Inventory">
              <Checkbox checked={variant?.manage_inventory} disabled />
            </Descriptions.Item>
            <Descriptions.Item label="Allow Backorders">
              <Checkbox checked={variant?.allow_backorder} disabled />
            </Descriptions.Item>
          </Descriptions>

          <Descriptions
            column={1}
            className="mt-6 fixed-labels"
            title="Shipping-dimensions"
            bordered
          >
            <Descriptions.Item label="Width">
              {variant?.width || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Length">
              {variant?.length || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Height">
              {variant?.height || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Weight">
              {variant?.weight || "--"}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            column={1}
            className="mt-6 fixed-labels"
            title="Shipping-customs"
            bordered
          >
            <Descriptions.Item label="Mid code">
              {variant?.mid_code || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="HS code">
              {variant?.hs_code || "--"}
            </Descriptions.Item>
            <Descriptions.Item label="Origin country">
              {variant?.origin_country || "--"}
            </Descriptions.Item>
          </Descriptions>

          {variant?.images?.length > 0 && (
            <div className="mt-6">
              <Text
                style={{ color: "rgba(0, 0, 0, 0.88)" }}
                className="text-[16px] font-semibold mb-[20px] d-block"
              >
                Images
              </Text>
              <div className="flex flex-wrap gap-x-3">
                {variant.images.map((image: any | string) => (
                  <Image
                    key={image.id}
                    width={100}
                    height={100}
                    src={image?.url || image}
                    alt={image.id}
                    style={{ marginRight: 10 }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* <Descriptions column={1} className="mt-6 fixed-labels" title="Metadata" bordered>
        {variant.metadata.map((meta, index) => (
          <Descriptions.Item label={meta.key} key={index}>
            {meta.value}
          </Descriptions.Item>
        ))}
      </Descriptions> */}
        </>
      )}
    </Modal>
  );
});

export default ViewVariantModal;
