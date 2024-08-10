import React from "react";
import { Product } from "src/models/product";
import { useState, useEffect, useRef } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import BodyCard from "./body-card";
import { Table, Toaster, useToast, DropdownMenu, Input, FocusModal } from "@medusajs/ui";
import IconBadge from "./icon-badge";
import { ArrowPath, ChevronDown, XCircleSolid } from "@medusajs/icons";
import Spinner from "./spinner";

export type productQueryType = {
  fields?: string;
  limit: number;
  offset: number;
  expand?: string;
  status?: string[];
  q?: string;
};

export type ProductRes = {
  offset: number;
  limit: number;
  count: number;
  products: Product[];
};

const ProductTab: React.FC = () => {
  const [pagination, setPagination] = useState({
    count: 0,
    pageSize: 15,
    pageIndex: 1,
    pageCount: 1,
    query: "",
  });
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [keyword, setKeyword] = useState("");
  const timer = useRef(null);
  const { toast } = useToast();
  const [checkAll, setCheckAll] = useState(false);
  const { data: productsRes, refetch: refetchProduct } = useAdminCustomQuery<productQueryType, ProductRes>(
    "/products",
    [],
    {
      offset: (pagination.pageIndex - 1) * pagination.pageSize,
      fields: "id,title,thumbnail,syncToMerchant",
      expand: "variants,options,variants.prices,variants.options,collection,tags,type,images,sales_channels",
      limit: pagination.pageSize,
      status: ["published"],
      ...(pagination?.query ? { q: pagination?.query } : {}),
    }
  );

  const [products, setProducts] = useState(productsRes?.products?.map((product) => ({ ...product, checked: false })));
  const { mutate } = useAdminCustomPost<any, any>(`/products/update/syncToMerchant`, []);

  const fetchProduct = () => {
    refetchProduct();
    setCheckAll(false);
    setLoadingProduct(false);
  };

  const handleChangeSearch = (e) => {
    setKeyword(e?.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setPagination({ ...pagination, query: e?.target?.value });
    }, 500);
  };

  const handleCheckAll = (e) => {
    setCheckAll(e?.currentTarget?.checked);
    const newProducts = products?.map((product) => ({ ...product, checked: e?.currentTarget?.checked }));
    setProducts(newProducts);
  };

  const handleSync = (type: "active" | "stop") => {
    const checkedItems = products?.filter((product) => product?.checked);
    const updateData = checkedItems?.map((product) => {
      const variants = product?.variants?.map((v) => ({
        id: v?.id,
      }));

      return {
        id: product?.id,
        syncToMerchant: type === "active",
        variants,
      };
    });
    toast({
      title: "Update Start",
      description: "Please wait for a few minutes!",
      variant: "warning",
      duration: 1500,
    });
    setLoadingProduct(true);
    mutate(updateData, {
      onSuccess: () => {
        fetchProduct();
        toast({
          title: "Update Successful",
          description: "Update Successful",
          variant: "success",
          duration: 1500,
        });
      },
      onError() {
        toast({
          title: "Update Error",
          description: "connect to google merchant failed",
          variant: "error",
          duration: 1500,
        });
        setLoadingProduct(false);
      },
    });
  };

  const productColumns: { title: React.ReactNode; key: string; class: string }[] = [
    {
      title: (
        <div className="flex gap-1">
          <input type="checkbox" onClick={handleCheckAll} checked={checkAll} style={{ cursor: "pointer" }}></input>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <ChevronDown className="cursor-pointer" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                className="gap-x-2"
                onClick={() => {
                  handleSync("active");
                }}
              >
                Active sync
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="gap-x-2"
                onClick={() => {
                  handleSync("stop");
                }}
              >
                Stop sync
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      ),
      key: "checkbox",
      class: "w-[75px]",
    },
    { title: "name", key: "name", class: "" },
    { title: "merchant status", key: "merchant_status", class: "w-[150px]" },
  ];

  const handleNextPage = () => {
    const page = pagination?.pageIndex + 1 > pagination?.pageCount ? pagination?.pageCount : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };
  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const handleCheckProduct = (e, product) => {
    const newProducts = products?.map((p) => {
      if (product?.id === p.id) {
        return { ...product, checked: e?.target?.checked };
      }
      return p;
    });
    setProducts(newProducts);
  };

  useEffect(() => {
    if (productsRes?.products?.length) {
      setProducts(productsRes?.products?.map((product) => ({ ...product, checked: false })));
      const pageCount = Math.ceil(productsRes?.count / pagination?.pageSize);
      setPagination({
        ...pagination,
        count: productsRes?.count,
        pageCount,
      });
      setCheckAll(false);
    }
  }, [productsRes]);

  return (
    <BodyCard
      customHeader={
        <div className="flex justify-end">
          <div className="w-[250px]">
            <Input placeholder="Search" id="search-input" type="search" value={keyword} onChange={handleChangeSearch} />
          </div>
        </div>
      }
    >
      <Toaster />
      {loadingProduct ? (
        <div className="flex items-center justify-center bg-white bg-opacity-50 w-full min-h-[400px]">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <>
          <Table className="m-h-[800px]">
            <Table.Header>
              <Table.Row>
                {productColumns.map((e) => (
                  <Table.HeaderCell key={e.key} className={e.class}>
                    {e.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products?.map((product, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        checked={!!product?.checked}
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          handleCheckProduct(e, product);
                        }}
                      ></input>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center">
                        <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                          <img src={product?.thumbnail} className="rounded-soft h-full object-cover" alt="" />
                        </div>
                        {product?.title}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="flex justify-center items-center">
                      {product.syncToMerchant ? (
                        <IconBadge>
                          <ArrowPath color="green" />
                        </IconBadge>
                      ) : (
                        <IconBadge>
                          <XCircleSolid color="red" />
                        </IconBadge>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
          <Table.Pagination
            canNextPage
            canPreviousPage
            count={productsRes?.count}
            pageSize={pagination.pageSize}
            pageIndex={pagination.pageIndex - 1}
            pageCount={Math.ceil(productsRes?.count / 15)}
            nextPage={handleNextPage}
            previousPage={handlePrePage}
          />
        </>
      )}
    </BodyCard>
  );
};
export default ProductTab;
