import { Heading, Input, Label } from "@medusajs/ui";
import { Col, Form, FormInstance, Row } from "antd";
import { Notify } from "../../media/MediaModal";

type TContactUsData = {
  header: string;
  form: {
    title: string;
    description: string;
  };
};

type TContactUsForm = {
  onFinish: (values: TContactUsData) => void;
  notify: Notify;
  form: FormInstance<TContactUsData>;
  initialValues: TContactUsData;
};

export default function ContactUsForm({
  notify,
  onFinish,
  initialValues,
  form,
}: TContactUsForm) {
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
        <Row gutter={[12, 12]}>
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Contact Us</Heading>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["header"]}
              rules={[
                {
                  required: true,
                  message: "Missing header",
                },
              ]}
            >
              <Input placeholder="Header" />
            </Form.Item>
          </Col>
          <Col span={24} className="flex mb-2">
            <Label>Form</Label>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["form", "title"]}
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
              name={["form", "description"]}
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
      </Form>
    </>
  );
}
