import { FC, useState, ChangeEvent, useRef, useEffect } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { ProductRes, productQueryType } from "../../shared/product-tab";
import { Checkbox, Input, Label } from "@medusajs/ui";

export type PickProductDataType = { selectedProducts: any[]; selectedVariants: any[] };

type FindProductProps = {
  onChangeSelected: (data: PickProductDataType) => void;
  defaultData?: PickProductDataType;
  isClear?: boolean;
};
const FindProduct: FC<FindProductProps> = ({ onChangeSelected, defaultData, isClear }) => {
  const timerRef = useRef<any>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
    query: "",
  });
  const { data: productsRes, refetch: refetchProduct } = useAdminCustomQuery<productQueryType, ProductRes>(
    "/products",
    [],
    {
      offset: (pagination.pageIndex - 1) * pagination.pageSize,
      fields: "id,title,thumbnail,syncToMerchant",
      expand: "variants,options,variants.prices,variants.options",
      limit: pagination.pageSize,
      status: ["published"],
      ...(pagination?.query ? { q: pagination?.query } : {}),
    }
  );

  const products = productsRes?.products;
  const [selectedProducts, setSelectedProducts] = useState<any[]>(defaultData?.selectedProducts || []);
  const [selectedVariants, setSelectedVariants] = useState<any[]>(defaultData?.selectedVariants || []);
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPagination({ ...pagination, query: e?.target.value });
    }, 400);
  };

  const handleChangeSelectProduct = (e: boolean | "indeterminate", product: any) => {
    if (e) {
      // add product
      const newSelectedProduct = [...selectedProducts];
      newSelectedProduct.push(product);
      setSelectedProducts(newSelectedProduct);

      // add variants
      const newSelectedVariants = selectedVariants?.filter(
        (selectedVariant) => !product?.variants?.some((v) => v.id === selectedVariant?.id)
      );
      const addData = newSelectedVariants.concat(product?.variants);
      setSelectedVariants(addData);
    } else {
      // remove product
      const newSelectedProduct = selectedProducts?.filter((e) => e?.id !== product?.id);
      setSelectedProducts(newSelectedProduct);
      // remove variants
      const newSelectedVariants = selectedVariants?.filter(
        (selectedVariant) => !product?.variants?.some((v) => v.id === selectedVariant?.id)
      );
      setSelectedVariants(newSelectedVariants);
    }
  };
  const handleChangeSelectVariant = (e: boolean | "indeterminate", variant: any, product: any) => {
    if (e) {
      //add variant to selected
      const newSelectedVariants = [...selectedVariants];
      newSelectedVariants.push(variant);
      setSelectedVariants(newSelectedVariants);

      // add product to selected if add variant selected
      const isHasProduct = selectedProducts?.find((p) => p.id === product?.id);
      if (!isHasProduct) {
        setSelectedProducts([...selectedProducts, product]);
      }
    } else {
      // remove variant from selected
      const newSelectedVariants = selectedVariants?.filter((e) => e?.id !== variant?.id);
      setSelectedVariants(newSelectedVariants);
      // remove Product from selected
      const isProductHasSelectedVariant = product?.variants?.some((variant) =>
        newSelectedVariants?.find((nVariant) => nVariant?.id === variant?.id)
      );
      if (!isProductHasSelectedVariant) {
        const newSelectedProducts = selectedProducts?.filter((selectedProduct) => selectedProduct?.id !== product?.id);
        setSelectedProducts(newSelectedProducts);
      }
    }
  };

  useEffect(() => {
    onChangeSelected({ selectedProducts, selectedVariants });
  }, [selectedProducts, selectedVariants]);
  useEffect(() => {
    if (isClear) {
      setSelectedProducts([]);
      setSelectedVariants([]);
    }
  }, [isClear]);
  return (
    <div className="w-full flex flex-col space-y-3 p-3">
      <div className="w-full">
        <Input placeholder="Search" id="search-input" type="search" onChange={handleChangeSearch} />
      </div>
      <div className="w-full overflow-y-auto h-[400px] flex flex-col space-y-2">
        {products?.map((product) => {
          const isAllVariantSelected = product?.variants?.every((variant) =>
            selectedVariants?.some((nVariant) => nVariant?.id === variant?.id)
          );

          const isSomeVariantSelected = product?.variants?.some((variant) =>
            selectedVariants?.some((nVariant) => nVariant?.id === variant?.id)
          );

          return (
            <div className="w-full flex flex-col space-y-2" key={product?.id}>
              <div className="flex space-x-2 items-center">
                <Checkbox
                  id={product?.id}
                  onCheckedChange={(e) => handleChangeSelectProduct(e, product)}
                  checked={isAllVariantSelected ? true : isSomeVariantSelected ? "indeterminate" : false}
                />
                <Label htmlFor={product?.id} className="flex space-x-2 items-center">
                  <div
                    className={`w-[40px] h-[40px] bg-contain bg-no-repeat`}
                    style={{ backgroundImage: `url('${product?.thumbnail}')` }}
                  ></div>
                  {product?.title}
                </Label>
              </div>
              {product?.variants?.map((variant) => {
                return (
                  <div className="flex items-center space-x-2 ml-6" key={variant?.id}>
                    <Checkbox
                      id={variant?.id}
                      onCheckedChange={(e) => handleChangeSelectVariant(e, variant, product)}
                      checked={selectedVariants?.some((p) => p?.id === variant?.id)}
                    />
                    <Label htmlFor={variant?.id}>{variant?.title}</Label>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default FindProduct;
