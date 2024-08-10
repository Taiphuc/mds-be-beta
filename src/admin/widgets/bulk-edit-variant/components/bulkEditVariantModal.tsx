import { Button, FocusModal } from "@medusajs/ui";
import { ProductVariantWithKey } from "../bulk-edit-variant";
import EditableTable, { ETypeEdit } from "../../../components/editable-table";
import { useState, useEffect } from "react";
import { countries } from "../../../components/utils/countries";

export type FormImage = {
  url: string;
  name?: string;
  size?: number;
  nativeFile?: File;
};

type Props = {
  variants: (ProductVariantWithKey & { children?: ProductVariantWithKey[] })[];
  open: boolean;
  onClose: () => void;
  onUpdate: (v: ProductVariantWithKey[]) => void;
  isLoadingBulkEdit: boolean;
};

const BulkEditVariantModal = ({
  open,
  variants,
  onClose,
  onUpdate,
  isLoadingBulkEdit,
}: Props) => {
  const [dataSource, setDataSource] = useState<ProductVariantWithKey[]>();
  useEffect(() => {
    setDataSource(
      variants.filter(
        (variant) =>
          !(variant.key.includes("-opt_") && variant.children?.length > 0)
      )
    );
  }, [variants]);

  const defaultColumns = [
    {
      title: "title",
      dataIndex: "title",
      width: 400,
      fixed: "left" as any,
    },
    {
      title: "material",
      dataIndex: "material",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "sku",
      dataIndex: "sku",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "inventory_quantity",
      dataIndex: "inventory_quantity",
      editable: { type: ETypeEdit.NUMBER },
    },
    {
      title: "ean",
      dataIndex: "ean",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "upc",
      dataIndex: "upc",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "barcode",
      dataIndex: "barcode",
      editable: { type: ETypeEdit.STRING },
    },
    {
      title: "manage_inventory",
      dataIndex: "manage_inventory",
      editable: { type: ETypeEdit.CHECKBOX },
    },
    {
      title: "allow_backorder",
      dataIndex: "allow_backorder",
      editable: { type: ETypeEdit.CHECKBOX },
    },
    {
      title: "mid_code",
      dataIndex: "mid_code",
      editable: { type: ETypeEdit.STRING },
    },
    // {
    //   title: "hs_code",
    //   dataIndex: "hs_code",
    //   editable: { type: ETypeEdit.STRING },
    // },
    // {
    //   title: "weight",
    //   dataIndex: "weight",
    //   editable: { type: ETypeEdit.NUMBER },
    // },
    // {
    //   title: "length",
    //   dataIndex: "length",
    //   editable: { type: ETypeEdit.NUMBER },
    // },
    // {
    //   title: "height",
    //   dataIndex: "height",
    //   editable: { type: ETypeEdit.NUMBER },
    // },
    // {
    //   title: "width",
    //   dataIndex: "width",
    //   editable: { type: ETypeEdit.NUMBER },
    // },
    {
      title: "origin_country",
      dataIndex: "origin_country",
      editable: {
        type: ETypeEdit.SELECT,
        options: countries.map((c) => ({
          label: c.name,
          value: c.alpha2,
        })),
      },
    },
  ];

  return (
    <FocusModal onOpenChange={onClose} open={open} modal>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button
            isLoading={isLoadingBulkEdit}
            onClick={() => onUpdate(dataSource)}
            variant="primary"
            type="submit"
            form="variant-images-form"
          >
            Save
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="p-4 overflow-modal">
          <EditableTable
            defaultColumns={defaultColumns}
            dataSource={dataSource}
            setDataSource={setDataSource}
          />
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};
export default BulkEditVariantModal;
