import type { WidgetConfig, ProductDetailsWidgetProps } from "@medusajs/admin";
import { Button, Container, Heading, Input } from "@medusajs/ui";
import { ProductOptionValue } from "@medusajs/medusa";
import { useState, useMemo, useRef } from "react";
import { useAdminProductTags, useAdminProductCategories, useAdminProducts, useAdminUpdateProduct } from "medusa-react";
import Spacer from "../../components/shared/spacer";
import { Select } from "antd";
type Inputs = {
  collections: string;
  tags: string;
};

const LinkedProductWidget = ({ product, notify }: ProductDetailsWidgetProps) => {
  const [relatedTags, setRelatedTags] = useState<string[]>([]);
  const [relatedCategories, setRelatedCategories] = useState<string[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [relatedOptions, setRelatedOptions] = useState<string[]>([]);
  const [searchProductsQuery, setSearchProductsQuery] = useState<string>();
  const { product_categories: categories, refetch: refetchCollections } = useAdminProductCategories();
  const updateProduct = useAdminUpdateProduct(product?.id);
  const { product_tags: productTags, refetch: refetchProductTags } = useAdminProductTags();
  const {
    products,
    refetch: refetchProducts,
    isLoading: isLoadingProduct,
  } = useAdminProducts({ ...(searchProductsQuery ? { q: searchProductsQuery } : {}) });
  const timerRef = useRef(null);
  const categoryOptions = useMemo(() => {
    const a =
      categories?.map((col) => {
        return { value: col.id, label: col.name };
      }) || [];
    return a;
  }, [categories]);
  const tagsOptions = useMemo(() => {
    return productTags?.map((tag) => ({ value: tag.id, label: tag.value })) || [];
  }, [productTags]);
  const productsOptions = useMemo(() => {
    return products?.map((res) => ({ value: res.id, label: res.title })) || [];
  }, [products]);
  const productOptions = useMemo(() => {
    const result: { value: string; label: string }[] = [];
    const options = product?.options;
    product?.variants?.forEach((variant) => {
      variant?.options?.forEach((optionValue) => {
        const parent = options?.find((option) => option.id === optionValue.option_id);
        const dataValue = `${parent?.title}/${optionValue.value}`;
        if (!result?.some((res) => res.value?.toLocaleLowerCase() === dataValue?.toLocaleLowerCase())) {
          result.push({ value: dataValue, label: dataValue });
        }
      });
    });
    const finalResult = result.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
    return finalResult;
  }, [product?.variants]);

  const handleChangeCategories = (value: string[]) => {
    setRelatedCategories(value);
  };
  const handleChangeTags = (value: string[]) => {
    setRelatedTags(value);
  };
  const handleChangeOptions = (value: string[]) => {
    setRelatedOptions(value);
  };
  const handleChangeProducts = (value: string[]) => {
    setRelatedProducts(value);
  };

  const handleChangeProductSearch = (e: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearchProductsQuery(e);
      // refetchProducts()
    }, 400);
  };

  const handleUpdateProduct = () => {
    updateProduct.mutate(
      {
        metadata: {
          related_tags: relatedTags,
          related_categories: relatedCategories,
          related_products: relatedProducts,
          related_options: relatedOptions,
        },
      },
      {
        onSuccess: () => {
          notify.success("Update successful", "Updated successfully");
        },
      }
    );
  };

  return (
    <Container>
      <div className="flex flex-wrap justify-between">
        <Heading level="h1" className="font-semibold pb-2">
          <span>Related Product</span>
        </Heading>
        <Button onClick={handleUpdateProduct}>Update</Button>
      </div>
      <Spacer />
      <div className="grid grid-cols-4 gap-2">
        <div>Related categories</div>
        <div className="col-span-5" style={{marginBottom: "12px"}}>
          <Select
              key={1}
              mode="multiple"
              allowClear
              size={"large"}
              style={{width: "100%"}}
              defaultValue={product?.metadata?.related_categories}
              placeholder="Please select categories"
              onChange={handleChangeCategories}
              options={categoryOptions}
          />
        </div>
        <div>Related Tags</div>
        <div className="col-span-5" style={{marginBottom: "12px"}}>
          <Select
              key={2}
              mode="multiple"
              allowClear
              size={"large"}
              defaultValue={product?.metadata?.related_tags}
              style={{width: "100%"}}
              placeholder="Please select tags"
              onChange={handleChangeTags}
              options={tagsOptions}
          />
        </div>
        <div>Related Options</div>
        <div className="col-span-5" style={{marginBottom: "12px"}}>
          <Select
              key={2}
              mode="multiple"
              allowClear
              size={"large"}
              style={{width: "100%"}}
              placeholder="Please select Options"
              defaultValue={product?.metadata?.related_options}
              onChange={handleChangeOptions}
              options={productOptions}
          />
        </div>
        {/*<div className="col-span-6">*/}
        {/*  <Input*/}
        {/*    placeholder="Keyword for get list product options"*/}
        {/*    onChange={(e) => {*/}
        {/*      handleChangeProductSearch(e.currentTarget.value);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</div>*/}
        <div>Related Products</div>
        <div className="col-span-5" style={{marginBottom: "12px"}}>
          <Select
              key={2}
              mode="multiple"
              allowClear
              size={"large"}
              style={{width: "100%"}}
              placeholder="Please select products"
              defaultValue={product?.metadata?.related_products}
              onChange={handleChangeProducts}
              options={productsOptions}
              loading={isLoadingProduct}
          />
        </div>
      </div>
    </Container>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default LinkedProductWidget;
