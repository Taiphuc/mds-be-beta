import { MinusCircleOutlined } from "@ant-design/icons";
import {
  ChevronLeftMini,
  ChevronRightMini,
  CloudArrowUp,
} from "@medusajs/icons";
import {
  Button,
  Heading,
  IconButton,
  Input,
  Label,
  useToggleState,
} from "@medusajs/ui";
import { Col, Form, FormInstance, Image, Row, Select, Spin } from "antd";
import { useAdminCollections, useAdminProductCategories } from "medusa-react";
import { useState } from "react";
import MediaModal, { Notify } from "../../media/MediaModal";
import { handleImageSelect } from "../libs/func";

interface ISliderButton {
  title: string;
  link: string;
}

interface ISliderItem {
  image: string;
  title: string;
  description1: string;
  description2: string;
  button1: ISliderButton;
  button2: ISliderButton;
}
interface ICategoryItem {
  image: string;
  link: string;
  title: string;
  description: string;
}
interface IFacilityItem {
  title: string;
  icon: string;
}
interface ISubscribe {
  title: string;
  description: string;
}
interface IPartnerItem {
  image: string;
  title: string;
}
interface IInstagramItem {
  image: string;
  link: string;
  title: string;
}
interface IHomePageData {
  data: { title: string; categories: string[] }[];
  slider: ISliderItem[];
  categories: ICategoryItem[];
  facility: IFacilityItem[];
  subscribe: ISubscribe;
  partner: IPartnerItem[];
  instagram: IInstagramItem[];
}

type THomeForm = {
  onFinish: (values: IHomePageData) => void;
  notify: Notify;
  form: FormInstance<IHomePageData>;
  initialValues: IHomePageData;
};
type TParams = {
  offset: number;
  limit: number;
};

export default function HomeForm({
  notify,
  onFinish,
  initialValues,
  form,
}: THomeForm) {
  const { state: isOpenMediaModal, toggle: toggleMediaModal } =
    useToggleState();
  const [imageUpdate, setImageUpdate] = useState<{
    formName: string;
    fieldName: string;
    index?: number;
  }>();

  const baseParams = { offset: 0, limit: 10 };
  const [params, setParams] = useState<TParams>({
    ...baseParams,
  });
  const {
    product_categories,
    isLoading: isLoadingCategory,
    count: count,
  } = useAdminProductCategories(params, {
    keepPreviousData: true,
  });
  const handlePageChange = (direction: "next" | "previous") => {
    setParams((prevParams) => ({
      ...prevParams,
      offset:
        direction === "next"
          ? prevParams.offset + params.limit
          : prevParams.offset - params.limit,
    }));
  };

  const baseParamsC = { offset: 0, limit: 10 };
  const [paramsC, setParamsC] = useState<TParams>({
    ...baseParamsC,
  });
  const {
    collections,
    isLoading: isLoadingCollection,
    count: countC,
  } = useAdminCollections(paramsC, {
    keepPreviousData: true,
  });
  const handlePageChangeC = (direction: "next" | "previous") => {
    setParamsC((prevParams) => ({
      ...prevParams,
      offset:
        direction === "next"
          ? prevParams.offset + params.limit
          : prevParams.offset - params.limit,
    }));
  };

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
        {/* Data Section */}
        <Form.List name="data">
          {(fields, { add, remove }) => (
            <Row gutter={[12, 12]}>
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Data Section</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={24}>
                  <Row gutter={[6, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Data Section {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
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
                    {product_categories && (
                      <Col span={24}>
                        <Form.Item {...restField} name={[name, "categories"]}>
                          <Select
                            loading={isLoadingCategory}
                            showSearch={false}
                            getPopupContainer={(node) => node.parentNode}
                            mode="multiple"
                            placeholder="Select categories"
                            notFoundContent={
                              isLoadingCategory ? <Spin size="small" /> : null
                            }
                            style={{ width: "100%" }}
                            dropdownRender={(menu) => (
                              <>
                                {menu}
                                {count > params.limit && (
                                  <div className="flex gap-x-1 justify-end items-center">
                                    <IconButton
                                      variant="transparent"
                                      onClick={() =>
                                        handlePageChange("previous")
                                      }
                                      disabled={
                                        params.offset === 0 || isLoadingCategory
                                      }
                                    >
                                      <ChevronLeftMini />
                                    </IconButton>
                                    <IconButton
                                      variant="transparent"
                                      onClick={() => handlePageChange("next")}
                                      disabled={
                                        params.offset + params.limit >= count ||
                                        isLoadingCategory
                                      }
                                    >
                                      <ChevronRightMini />
                                    </IconButton>
                                  </div>
                                )}
                              </>
                            )}
                          >
                            {product_categories.map((cate) => (
                              <Select.Option key={cate.id} value={cate.id}>
                                {cate.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}
                    {collections && (
                      <Col span={24}>
                        <Form.Item {...restField} name={[name, "collections"]}>
                          <Select
                            loading={isLoadingCollection}
                            showSearch={false}
                            getPopupContainer={(node) => node.parentNode}
                            mode="multiple"
                            placeholder="Select collections"
                            notFoundContent={
                              isLoadingCollection ? <Spin size="small" /> : null
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
                                        handlePageChangeC("previous")
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
                                      onClick={() => handlePageChangeC("next")}
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
                        </Form.Item>
                      </Col>
                    )}
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
                  Add Data section
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Slider Section */}
        <Form.List name="slider">
          {(fields, { add, remove }) => (
            <Row gutter={[12, 12]}>
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Slider</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={24}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Slider {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "image"]}
                        label="Image"
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
                              formName: "slider",
                              fieldName: "image",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["slider", name, "image"]) && (
                          <Image
                            src={form.getFieldValue(["slider", name, "image"])}
                            alt={`Image ${key}`}
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
                      <Row gutter={[6, 0]}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "description1"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing description 1",
                              },
                            ]}
                          >
                            <Input placeholder="Description 1" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "description2"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing description 2",
                              },
                            ]}
                          >
                            <Input placeholder="Description 2" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Label className="block mb-2">Button 1</Label>
                      <Row gutter={[6, 0]}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "button1", "title"]}
                            rules={[
                              { required: true, message: "Missing title" },
                            ]}
                          >
                            <Input placeholder="Title" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "button1", "link"]}
                            rules={[
                              { required: true, message: "Missing link" },
                            ]}
                          >
                            <Input placeholder="Link" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Label className="block mb-2">Button 2</Label>
                      <Row gutter={[6, 0]}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "button2", "title"]}
                            rules={[
                              { required: true, message: "Missing title" },
                            ]}
                          >
                            <Input placeholder="Title" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "button2", "link"]}
                            rules={[
                              { required: true, message: "Missing link" },
                            ]}
                          >
                            <Input placeholder="Link" />
                          </Form.Item>
                        </Col>
                      </Row>
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
                  Add Slider
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Categories Section */}
        <Form.List name="categories">
          {(fields, { add, remove }) => (
            <Row
              gutter={[12, 12]}
              className="border-t border-gray-300 pt-1.5 mt-3"
            >
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Category</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={24}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Category {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "image"]}
                        label="Image"
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
                              formName: "categories",
                              fieldName: "image",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["categories", name, "image"]) && (
                          <Image
                            src={form.getFieldValue([
                              "categories",
                              name,
                              "image",
                            ])}
                            alt={`Image ${key}`}
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
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
                    <Col span={24}>
                      <Row gutter={[6, 0]}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "title"]}
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
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
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
                  Add Category
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Facility Section */}
        <Form.List name="facility">
          {(fields, { add, remove }) => (
            <Row
              gutter={[12, 12]}
              className="border-t border-gray-300 pt-1.5 mt-3"
            >
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Facility</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={12}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Facility {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
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
                        {...restField}
                        name={[name, "icon"]}
                        label="icon"
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
                              formName: "facility",
                              fieldName: "icon",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["facility", name, "icon"]) && (
                          <Image
                            src={form.getFieldValue(["facility", name, "icon"])}
                            alt={`Icon ${key}`}
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
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
                  Add Facility
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Subscribe Section */}
        <Row gutter={[12, 12]} className="border-t border-gray-300 pt-1.5 mt-3">
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Subscribe</Heading>
          </Col>
          <Col span={24}>
            <Form.Item
              name={["subscribe", "title"]}
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
              name={["subscribe", "description"]}
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

        {/* Partner Section */}
        <Form.List name="partner">
          {(fields, { add, remove }) => (
            <Row
              gutter={[12, 12]}
              className="border-t border-gray-300 pt-1.5 mt-3"
            >
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Partner</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={12}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Partner {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "image"]}
                        label="Image"
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
                              formName: "partner",
                              fieldName: "image",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["partner", name, "image"]) && (
                          <Image
                            src={form.getFieldValue(["partner", name, "image"])}
                            alt={`Image ${key}`}
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, "title"]}>
                        <Input placeholder="Title" />
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
                  Add Partner
                </Button>
              </Col>
            </Row>
          )}
        </Form.List>

        {/* Instagram Section */}
        <Form.List name="instagram">
          {(fields, { add, remove }) => (
            <Row
              gutter={[12, 12]}
              className="border-t border-gray-300 pt-1.5 mt-3"
            >
              <Col span={24} className="flex mb-2">
                <Heading level="h1">Instagram</Heading>
              </Col>
              {fields.map(({ key, name, ...restField }, index) => (
                <Col key={key} span={12}>
                  <Row gutter={[0, 6]}>
                    <Col
                      span={24}
                      className="flex justify-between items-center"
                    >
                      <Label className="italic">Instagram {index + 1}</Label>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        {...restField}
                        name={[name, "image"]}
                        label="Image"
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
                              formName: "instagram",
                              fieldName: "image",
                            });
                            toggleMediaModal();
                          }}
                        >
                          <CloudArrowUp />
                          Select Image
                        </Button>
                        {form.getFieldValue(["instagram", name, "image"]) && (
                          <Image
                            src={form.getFieldValue([
                              "instagram",
                              name,
                              "image",
                            ])}
                            alt={`Image ${key}`}
                            className="max-w-full max-h-[300px] object-contain"
                          />
                        )}
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
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, "title"]}>
                        <Input placeholder="Title" />
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
                  Add Instagram
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
