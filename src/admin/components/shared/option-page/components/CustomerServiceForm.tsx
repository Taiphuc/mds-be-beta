import { MinusCircleOutlined } from "@ant-design/icons";
import { CloudArrowUp } from "@medusajs/icons";
import { Button, Heading, Input, Label, useToggleState } from "@medusajs/ui";
import { Col, Form, FormInstance, Image, Row } from "antd";
import { useState } from "react";
import MediaModal, { Notify } from "../../media/MediaModal";
import { handleImageSelect } from "../libs/func";

type TopPanelItem = {
  description1: string;
  description2: string;
  link: string;
};
type Introduce = {
  logo: string;
  name: string;
  description: string;
};
type AddressInfo = {
  address: string;
  phone: string;
  email: string;
  fax: string;
};
type Address = {
  title: string;
  description: string;
  info: AddressInfo;
};
type TimeOpenItem = {
  day: string;
  time: string;
};
type TimeOpen = {
  title: string;
  description: string;
  info: TimeOpenItem[];
};
type SocialItem = {
  link: string;
  icon: string;
  title: string;
};
type TCustomerServiceData = {
  topPanel: TopPanelItem[];
  introduce: Introduce;
  address: Address;
  timeOpen: TimeOpen;
  social: SocialItem[];
};

type TCustomerServiceForm = {
  onFinish: (values: TCustomerServiceData) => void;
  notify: Notify;
  form: FormInstance<TCustomerServiceData>;
  initialValues: TCustomerServiceData;
};

export default function CustomerServiceForm({
  notify,
  onFinish,
  initialValues,
  form,
}: TCustomerServiceForm) {
  const { state: isOpenMediaModal, toggle: toggleMediaModal } =
    useToggleState();
  const [imageUpdate, setImageUpdate] = useState<{
    formName: string;
    fieldName: string;
    index?: number;
  }>();

  return (
    <>
      <Form
        scrollToFirstError
        form={form}
        initialValues={initialValues}
        name="metadata"
        onFinish={onFinish}
        layout="vertical"
      >
        {/* Top Panel Section */}
        <Form.List name="topPanel">
          {(fields, { add, remove }) => (
            <Row gutter={[12, 12]}>
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Top Panel</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={12}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Top Panel {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "link"]}
                        rules={[{ required: true, message: "Missing link" }]}
                      >
                        <Input placeholder="Link" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "description1"]}
                        rules={[
                          { required: true, message: "Missing description1" },
                        ]}
                      >
                        <Input placeholder="Description 1" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "description2"]}
                        rules={[
                          { required: true, message: "Missing description2" },
                        ]}
                      >
                        <Input placeholder="Description 2" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              ))}
              <Col span={24}>
                <Button
                  type="button"
                  variant="primary"
                  className="float-right"
                  onClick={() => add()}
                >
                  Add Top Panel
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Introduce Section */}
        <Row gutter={[12, 12]} className="border-t border-gray-300 pt-1.5 mt-3">
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Introduce</Heading>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["introduce", "logo"]}
              label="Logo"
              rules={[{ required: true, message: "Missing image URL" }]}
            >
              <Button
                type="button"
                variant="secondary"
                className="flex items-center mb-2"
                onClick={() => {
                  setImageUpdate({
                    formName: "introduce",
                    fieldName: "logo",
                  });
                  toggleMediaModal();
                }}
              >
                <CloudArrowUp />
                Select Image
              </Button>
              {form.getFieldValue(["introduce", "logo"]) && (
                <Image
                  src={form.getFieldValue(["introduce", "logo"])}
                  alt={`logo`}
                  className="max-w-full max-h-[300px] object-contain"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name={["introduce", "name"]}>
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["introduce", "description"]}
              rules={[
                {
                  required: true,
                  message: "Missing description",
                },
              ]}
            >
              <Input placeholder="Description" />
            </Form.Item>
          </Col>
        </Row>

        {/* Address Section */}
        <Row gutter={[12, 12]} className="border-t border-gray-300 pt-1.5 mt-3">
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Address</Heading>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["address", "title"]}
              rules={[
                {
                  required: true,
                  message: "Missing title",
                },
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["address", "description"]}
              rules={[
                {
                  required: true,
                  message: "Missing description",
                },
              ]}
            >
              <Input placeholder="Description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["address", "info", "address"]}
              rules={[
                {
                  required: true,
                  message: "Missing address",
                },
              ]}
            >
              <Input placeholder="Address" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["address", "info", "phone"]}
              rules={[
                {
                  required: true,
                  message: "Missing phone",
                },
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["address", "info", "email"]}
              rules={[
                {
                  required: true,
                  message: "Missing email",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={["address", "info", "fax"]}
              rules={[
                {
                  required: true,
                  message: "Missing fax",
                },
              ]}
            >
              <Input placeholder="Fax" />
            </Form.Item>
          </Col>
        </Row>

        {/* Time Open Section */}
        <Row gutter={[12, 12]} className="border-t border-gray-300 pt-1.5 mt-3">
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Time Open</Heading>
          </Col>

          <Col span={24}>
            <Form.Item
              name={["timeOpen", "title"]}
              rules={[
                {
                  required: true,
                  message: "Missing title",
                },
              ]}
            >
              <Input placeholder="Title" />
            </Form.Item>
          </Col>
          <Form.List name={["timeOpen", "info"]}>
            {(fields, { add, remove }) => (
              <>
                <Col span={24}>
                  <Form.Item name={["timeOpen", "description"]}>
                    <Input placeholder="Description" />
                  </Form.Item>
                </Col>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Col key={key} span={12}>
                    <Row gutter={[6, 6]}>
                      <Col
                        span={24}
                        className="flex justify-between items-center"
                      >
                        <Label className="italic">Day {index + 1}</Label>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "day"]}
                          rules={[{ required: true, message: "Missing day" }]}
                        >
                          <Input placeholder="Day" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, "time"]}
                          rules={[{ required: true, message: "Missing time" }]}
                        >
                          <Input placeholder="Time" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                ))}
                <Col span={24}>
                  <Button
                    type="button"
                    variant="primary"
                    className="float-right"
                    onClick={() => add()}
                  >
                    Add Day
                  </Button>
                </Col>
              </>
            )}
          </Form.List>
        </Row>

        {/* Social Section */}
        <Form.List name="social">
          {(fields, { add, remove }) => (
            <Row
              gutter={[12, 12]}
              className="border-t border-gray-300 pt-1.5 mt-3"
            >
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Social</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={12}>
                  <Row gutter={[6, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Social {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "icon"]}
                        label="Icon"
                        rules={[
                          { required: true, message: "Missing image URL" },
                        ]}
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          className="flex items-center mb-2"
                          onClick={() => {
                            setImageUpdate({
                              index: index,
                              formName: "social",
                              fieldName: "icon",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["social", name, "icon"]) && (
                          <Image
                            src={form.getFieldValue(["social", name, "icon"])}
                            alt={`Icon ${key}`}
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Missing title" }]}
                      >
                        <Input placeholder="Title" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "link"]}
                        rules={[{ required: true, message: "Missing link" }]}
                      >
                        <Input placeholder="Link" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              ))}
              <Col span={24}>
                <Button
                  type="button"
                  variant="primary"
                  className="float-right"
                  onClick={() => add()}
                >
                  Add Social
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>
      </Form>
      <MediaModal
        type="thumbnail"
        notify={notify}
        onFinish={(files) =>
          handleImageSelect(files, form, imageUpdate, toggleMediaModal)
        }
        onClose={() => toggleMediaModal()}
        open={isOpenMediaModal}
      />
    </>
  );
}
