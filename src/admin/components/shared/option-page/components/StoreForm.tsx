import { ChevronLeftMini, ChevronRightMini } from "@medusajs/icons";
import { Heading, IconButton, Label } from "@medusajs/ui";
import { Col, Form, FormInstance, Row, Select, Spin } from "antd";
import {
  useAdminCollections,
  useAdminProductCategories,
  useAdminProductTags,
} from "medusa-react";
import { Notify } from "../../media/MediaModal";
import { useState } from "react";
import { ProductTag } from "@medusajs/medusa";

type TStoreData = {
  popular_products: {
    categories: string;
    collections: string;
  };
  popular_tags: ProductTag[];
};

type TContactUsForm = {
  onFinish: (values: TStoreData) => void;
  notify: Notify;
  form: FormInstance<TStoreData>;
  initialValues: TStoreData;
};
type TParams = {
  offset: number;
  limit: number;
};

export default function StoreForm({
  notify,
  onFinish,
  initialValues,
  form,
}: TContactUsForm) {
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
          ? prevParams.offset + paramsC.limit
          : prevParams.offset - paramsC.limit,
    }));
  };

  const baseParamsT = { offset: 0, limit: 50 };
  const [paramsT, setParamsT] = useState<TParams>({
    ...baseParamsT,
  });
  const {
    product_tags,
    isLoading: isLoadingTags,
    count: countT,
  } = useAdminProductTags(
    { ...paramsT, order: "value" },
    {
      keepPreviousData: true,
    }
  );
  const handlePageChangeT = (direction: "next" | "previous") => {
    setParamsT((prevParams) => ({
      ...prevParams,
      offset:
        direction === "next"
          ? prevParams.offset + paramsT.limit
          : prevParams.offset - paramsT.limit,
    }));
  };
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>(
    initialValues.popular_tags || []
  );
  const handleTagClick = (tag: ProductTag) => {
    const currentTags: ProductTag[] = form.getFieldValue("popular_tags") || [];
    let newSelectedTags: ProductTag[];
    if (currentTags.find((t) => t.id === tag.id)) {
      newSelectedTags = currentTags.filter((t) => t.id !== tag.id);
    } else {
      newSelectedTags = [...currentTags, tag];
    }

    setSelectedTags(newSelectedTags);
    form.setFieldValue("popular_tags", newSelectedTags);
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
        <Row gutter={[12, 12]}>
          <Col span={24} className="flex mb-2">
            <Heading level="h1">Store</Heading>
          </Col>
          <Col span={24}>
            <Label>Popular products</Label>
          </Col>
          {product_categories && (
            <Col span={24}>
              <Form.Item name={["popular_products", "categories"]}>
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
                            type="button"
                            variant="transparent"
                            onClick={() => handlePageChange("previous")}
                            disabled={params.offset === 0 || isLoadingCategory}
                          >
                            <ChevronLeftMini />
                          </IconButton>
                          <IconButton
                            type="button"
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
              <Form.Item name={["popular_products", "collections"]}>
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
                            type="button"
                            variant="transparent"
                            onClick={() => handlePageChangeC("previous")}
                            disabled={
                              paramsC.offset === 0 || isLoadingCollection
                            }
                          >
                            <ChevronLeftMini />
                          </IconButton>
                          <IconButton
                            type="button"
                            variant="transparent"
                            onClick={() => handlePageChangeC("next")}
                            disabled={
                              paramsC.offset + paramsC.limit >= countC ||
                              isLoadingCollection
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
                    <Select.Option key={collection.id} value={collection.id}>
                      {collection.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col span={24}>
            <Label>Popular tags</Label>
          </Col>
          {product_tags && (
            <Col span={24}>
              <Row gutter={[6, 6]}>
                {product_tags.map((tag) => (
                  <Col
                    key={tag.id}
                    className={`cursor-pointer rounded-full border mr-2 ${
                      selectedTags.find((v: ProductTag) => v.id === tag.id)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <span className="px-3 py-1">{tag.value}</span>
                  </Col>
                ))}
              </Row>
              {countT > paramsT.limit && (
                <div className="mt-2 flex gap-x-1 justify-end items-center">
                  <IconButton
                    type="button"
                    variant="transparent"
                    onClick={() => handlePageChangeT("previous")}
                    disabled={paramsT.offset === 0 || isLoadingTags}
                  >
                    <ChevronLeftMini />
                  </IconButton>
                  <IconButton
                    type="button"
                    variant="transparent"
                    onClick={() => handlePageChangeT("next")}
                    disabled={
                      paramsT.offset + paramsT.limit >= countT || isLoadingTags
                    }
                  >
                    <ChevronRightMini />
                  </IconButton>
                </div>
              )}
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
}
