import { Product } from "@medusajs/medusa";
import { Table, TableColumnsType } from "antd";
import { useState } from "react";
import { Notify } from "../../../components/types/extensions";
import MediaVariantsModal from "../../../components/VariantsImages/MediaVariantsModal";
import { columnsF, normalizeString } from "../utils/func";
import { ProductVariantWithKey, TVariantGroups } from "../bulk-edit-variant";
import ViewVariantModal, { THandleViewVariantModal } from "./viewVariantModal";
import { useRef } from "react";

type TBulkTable = {
  variants: ProductVariantWithKey[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariantWithKey[]>>;
  variantGroups: TVariantGroups[];
  selectedRowKeys: React.Key[];
  onSelectChange: (
    selectedRowKeys: React.Key[],
    selectedRows: ProductVariantWithKey[]
  ) => void;
  setIsChange: (v: boolean) => void;
  product: Product;
  notify: Notify;
};

export default function BulkTable({
  setIsChange,
  variants,
  setVariants,
  variantGroups,
  onSelectChange,
  selectedRowKeys,
  product,
  notify,
}: TBulkTable) {
  // Update media
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [variantUpload, setVariantUpload] = useState<
    ProductVariantWithKey[] | null
  >(null);

  const onOpenUpload = (variantKey: string, isChildren: boolean) => {
    let targetUpload: ProductVariantWithKey[];
    if (!isChildren) {
      const parentVariant = variantGroups.find(
        (variantGroup) => variantGroup.key === variantKey
      );
      if (parentVariant?.children) {
        targetUpload = [...parentVariant.children];
      } else {
        targetUpload = [parentVariant as any];
      }
    } else {
      const targetVariant = variants.find(
        (variant) =>
          normalizeString(variant.key) === normalizeString(variantKey)
      );
      targetUpload = [targetVariant];
    }
    setIsOpenUpload(true);
    setVariantUpload(targetUpload);
  };

  const onUpload = (data: {
    media: { images: { url: string; selected: boolean }[] };
  }) => {
    const thumbnail = data.media.images.find((image) => image.selected).url;
    const result: ProductVariantWithKey[] = variantUpload.map(
      (variant) =>
        ({
          ...variant,
          thumbnail,
        } as ProductVariantWithKey)
    );
    setVariants((prevVariants) => {
      return prevVariants.map((variant) => {
        const updated = result.find(
          (v) => normalizeString(v.key) === normalizeString(variant.key)
        );
        if (updated) {
          return { ...updated, isUpdated: true } as ProductVariantWithKey;
        }
        return variant;
      });
    });
    setIsChange(true);
    setIsOpenUpload(false);
    setVariantUpload(null);
  };

  const onUndo = (key: string) => {
    const newVariants = [...variants];
    const indexUndo = newVariants.findIndex((variant) => variant.key === key);
    newVariants.splice(indexUndo, 1, {
      ...newVariants[indexUndo],
      isDeleted: false,
    } as ProductVariantWithKey);
    setVariants(newVariants);
  };

  const viewVariantRef = useRef<THandleViewVariantModal>(null);
  const columns: TableColumnsType<any> = columnsF({
    onOpenUpload,
    onUndo,
    viewVariantRef,
  });
  return (
    <>
      <Table
        pagination={false}
        className="ant-table-custom"
        columns={columns}
        rowKey="key"
        rowClassName={(record) => {
          if (record.isDeleted) return "deleted";
          return "";
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
          checkStrictly: false,
          getCheckboxProps: (record) => ({
            disabled: record.isDeleted,
          }),
        }}
        dataSource={variantGroups}
      />
      {variantUpload && (
        <MediaVariantsModal
          onUpload={onUpload}
          notify={notify}
          type="thumbnail"
          product={product}
          variants={variantUpload}
          open={isOpenUpload}
          onClose={() => setIsOpenUpload(false)}
        />
      )}
      <ViewVariantModal ref={viewVariantRef} />
    </>
  );
}
