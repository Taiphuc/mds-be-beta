import { ProductVariant } from "@medusajs/medusa";
import { Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ProductVariantWithKey } from "../bulk-edit-variant";

export type THandleEditFieldModal = {
  onOpen: (x: boolean, type?: ETypeBulkEditVariant, title?: string) => void;
};

export type TEditFieldModal = {
  onSubmit: (v: any) => void;
  // variants: ProductVariantWithKey[];
  selectedRows: ProductVariantWithKey[];
  selectedRowKeys: React.Key[];
};

export enum ETypeBulkEditVariant {
  E_SKUs = "E_SKUs",
  E_quantities = "E_quantities",
  E_Prices = "E_Prices",
  E_Barcodes = "E_Barcodes",
  E_Dimensions = "E_Dimensions",
  E_HS_Codes = "E_HS_Codes",
}

const EditFieldModal = forwardRef(
  ({ onSubmit, selectedRows }: TEditFieldModal, ref) => {
    const [form] = Form.useForm();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        onOpen: (x: boolean, type?: string, title?: string) => {
          setIsOpen(x);
          setType(type || "");
          setTitle(title || "");
        },
      }),
      []
    );

    const onClose = () => {
      setIsOpen(false);
      form.resetFields();
    };

    return (
      <Modal
        width={700}
        open={isOpen}
        title={title}
        onCancel={onClose}
        onOk={() => form.submit()}
        okButtonProps={{ size: "small", type: "default", danger: true }}
        cancelButtonProps={{ size: "small" }}
        forceRender
        okText="Done"
      >
        <Form
          layout="horizontal"
          form={form}
          onFinish={(values) => {
            onSubmit(values);
            onClose();
          }}
          onFinishFailed={(err) => console.log("err", err)}
        >
          {type === ETypeBulkEditVariant.E_SKUs && (
            <Form.List name={ETypeBulkEditVariant.E_SKUs}>
              {() => {
                return selectedRows
                  .filter((row) => !row.key.includes("-opt_"))
                  .map((row) => (
                    <Form.Item
                      initialValue={row.sku}
                      key={row.key}
                      label={row.key}
                      name={row.key}
                    >
                      <Input className="max-w-[300px] float-right" />
                    </Form.Item>
                  ));
              }}
            </Form.List>
          )}
          {type === ETypeBulkEditVariant.E_quantities && (
            <Form.List name={ETypeBulkEditVariant.E_quantities}>
              {() => {
                return selectedRows
                  .filter((row) => !row.key.includes("-opt_"))
                  .map((row) => (
                    <Form.Item
                      initialValue={row.inventory_quantity}
                      key={row.key}
                      label={row.key}
                      name={row.key}
                    >
                      <InputNumber min={0} className="w-[300px] float-right" />
                    </Form.Item>
                  ));
              }}
            </Form.List>
          )}
          {type === ETypeBulkEditVariant.E_Barcodes && (
            <Form.List name={ETypeBulkEditVariant.E_Barcodes}>
              {() => {
                return selectedRows
                  .filter((row) => !row.key.includes("-opt_"))
                  .map((row) => (
                    <Form.Item
                      initialValue={row.barcode}
                      key={row.key}
                      label={row.key}
                      name={row.key}
                    >
                      <Input className="max-w-[300px] float-right" />
                    </Form.Item>
                  ));
              }}
            </Form.List>
          )}
          {type === ETypeBulkEditVariant.E_Dimensions && (
            <Form.List name={ETypeBulkEditVariant.E_Dimensions}>
              {() => {
                return (
                  <Row gutter={[0, 12]}>
                    <Col span={24}>
                      <Form.Item key="Width" label="Width" name="width">
                        <InputNumber
                          min={0}
                          className="w-[300px] float-right"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item key="Length" label="Length" name="length">
                        <InputNumber
                          min={0}
                          className="w-[300px] float-right"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item key="Height" label="Height" name="height">
                        <InputNumber
                          min={0}
                          className="w-[300px] float-right"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item key="Weight" label="Weight" name="weight">
                        <InputNumber
                          min={0}
                          className="w-[300px] float-right"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }}
            </Form.List>
          )}
          {type === ETypeBulkEditVariant.E_HS_Codes && (
            <Form.List name={ETypeBulkEditVariant.E_HS_Codes}>
              {() => {
                return (
                  <Row gutter={[0, 12]}>
                    <Col span={24}>
                      <Form.Item key="HS_codes" label="HS codes" name="hs_code">
                        <Input className="max-w-[300px] float-right" />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }}
            </Form.List>
          )}
        </Form>
      </Modal>
    );
  }
);

export default EditFieldModal;
