import { ProductDetailsWidgetProps, WidgetConfig } from "@medusajs/admin";
import {
  Check,
  EllipsisHorizontal,
  Funnel,
  PencilSquare,
  Plus,
  Trash,
  XMark,
} from "@medusajs/icons";
import {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "@medusajs/medusa";
import {
  Button,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  Label,
} from "@medusajs/ui";
import { Select } from "antd";
import { omit, pick } from "lodash";
import {
  useAdminCreateProductOption,
  useAdminCreateVariant,
  useAdminCustomPost,
  useAdminDeleteProductOption,
  useAdminDeleteVariant,
  useAdminUpdateVariant,
} from "medusa-react";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import OptionsProvider, {
  useOptionsContext,
} from "../../components/organisms/options-provider";
import { getErrorMessage } from "../../components/utils/error-messages";
import BulkVariantsModal from "../../components/VariantsImages/MediaVariantsModal";
import BulkEditVariantModal from "./components/bulkEditVariantModal";
import BulkTable from "./components/bulkTable";
import EditFieldModal, {
  ETypeBulkEditVariant,
  THandleEditFieldModal,
} from "./components/editFieldModal";
import Options from "./components/option";
import "./style.css";
import {
  createVariants,
  filterUndefinedValues,
  groupByVariants,
  mergeVariants,
  mergeVariantsWithOptions,
} from "./utils/func";

export type TOption = {
  title?: string;
  values?: Partial<ProductOptionValue>[];
  isDone?: boolean;
  id?: string;
};

export type ProductVariantWithKey = ProductVariant & {
  key?: string;
  keyTitle?: string;
  isNew?: boolean;
  isDeleted?: boolean;
  isUpdatedImages?: boolean;
  isUpdated?: boolean;
};

export type TVariantGroups = {
  title: string;
  key: string;
  idOption: string;
  inventory_quantity: number;
  children: ProductVariantWithKey[];
};

[
  {
    status: "Create successfully",
    data: {
      title: "Khaki Survival Shirt - XXL / Red",
      product_id: "prod_01J3FAG2WS1RP7S4D7NZXGDQHF",
      variant_rank: 7,
      inventory_quantity: 0,
      allow_backorder: false,
      manage_inventory: true,
      options: [
        {
          value: "XXL",
          option_id: "opt_01J3FAG2X3FB8ZWNQZDH97VPKP",
          metadata: {
            stt: 4,
          },
          id: "optval_01J3S08HQ47BAKX356KN7AYJBE",
          variant_id: "variant_01J3S08HQ43Z6PZ0VBNQDPQP00",
          deleted_at: null,
          created_at: "2024-07-27T02:28:04.562Z",
          updated_at: "2024-07-27T02:28:04.562Z",
        },
        {
          value: "Red",
          option_id: "opt_01J3S07ZK48YC21WYQG1J80F7N",
          metadata: {
            stt: 0,
            hex: "red",
          },
          id: "optval_01J3S08HQ4SHNBF6CSDQGAG1XJ",
          variant_id: "variant_01J3S08HQ43Z6PZ0VBNQDPQP00",
          deleted_at: null,
          created_at: "2024-07-27T02:28:04.562Z",
          updated_at: "2024-07-27T02:28:04.562Z",
        },
      ],
      id: "variant_01J3S08HQ43Z6PZ0VBNQDPQP00",
      created_at: "2024-07-27T02:28:04.562Z",
      updated_at: "2024-07-27T02:28:04.562Z",
    },
  },
  {
    status: "Create successfully",
    data: {
      title: "Khaki Survival Shirt - 3XL / Red",
      product_id: "prod_01J3FAG2WS1RP7S4D7NZXGDQHF",
      variant_rank: 7,
      inventory_quantity: 0,
      allow_backorder: false,
      manage_inventory: true,
      options: [
        {
          value: "3XL",
          option_id: "opt_01J3FAG2X3FB8ZWNQZDH97VPKP",
          metadata: {
            stt: 5,
          },
          id: "optval_01J3S08HPWYZZGXVZJ329TKTJ4",
          variant_id: "variant_01J3S08HPWH5CWZBESXVJQVPAG",
          deleted_at: null,
          created_at: "2024-07-27T02:28:04.568Z",
          updated_at: "2024-07-27T02:28:04.568Z",
        },
        {
          value: "Red",
          option_id: "opt_01J3S07ZK48YC21WYQG1J80F7N",
          metadata: {
            stt: 0,
            hex: "red",
          },
          id: "optval_01J3S08HPW1A7HXBDB53FADM4F",
          variant_id: "variant_01J3S08HPWH5CWZBESXVJQVPAG",
          deleted_at: null,
          created_at: "2024-07-27T02:28:04.568Z",
          updated_at: "2024-07-27T02:28:04.568Z",
        },
      ],
      id: "variant_01J3S08HPWH5CWZBESXVJQVPAG",
      created_at: "2024-07-27T02:28:04.568Z",
      updated_at: "2024-07-27T02:28:04.568Z",
    },
  },
  {
    status: "Create successfully",
    data: {
      title: "Khaki Survival Shirt - 5XL / Red",
      product_id: "prod_01J3FAG2WS1RP7S4D7NZXGDQHF",
      variant_rank: 13,
      inventory_quantity: 0,
      allow_backorder: false,
      manage_inventory: true,
      options: [
        {
          value: "5XL",
          option_id: "opt_01J3FAG2X3FB8ZWNQZDH97VPKP",
          metadata: {
            stt: 6,
          },
          id: "optval_01J3S08KZ43F8YYXX0T3M506BN",
          variant_id: "variant_01J3S08KZ4SFDMPVERWDDP92BX",
          deleted_at: null,
          created_at: "2024-07-27T02:28:06.790Z",
          updated_at: "2024-07-27T02:28:06.790Z",
        },
        {
          value: "Red",
          option_id: "opt_01J3S07ZK48YC21WYQG1J80F7N",
          metadata: {
            stt: 0,
            hex: "red",
          },
          id: "optval_01J3S08KZ4X4C9MFF18R8PRS61",
          variant_id: "variant_01J3S08KZ4SFDMPVERWDDP92BX",
          deleted_at: null,
          created_at: "2024-07-27T02:28:06.790Z",
          updated_at: "2024-07-27T02:28:06.790Z",
        },
      ],
      id: "variant_01J3S08KZ4SFDMPVERWDDP92BX",
      created_at: "2024-07-27T02:28:06.790Z",
      updated_at: "2024-07-27T02:28:06.790Z",
    },
  },
];

const BulkEditVariantWidget = ({
  product,
  notify,
}: ProductDetailsWidgetProps) => {
  return (
    <OptionsProvider expand="options,options.values" product={product}>
      <VariantImage product={product} notify={notify} />
    </OptionsProvider>
  );
};

const VariantImage = ({ product, notify }: ProductDetailsWidgetProps) => {
  // Option
  const { options: initOptions, status: initOptionsStatus } =
    useOptionsContext();
  const [options, setOptions] = useState<TOption[]>([]);

  const [isChange, setIsChange] = useState(false);
  const handleDoneOption = (value: TOption, index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1, { ...value, isDone: true });
    setOptions(newOptions);
    setIsChange(true);
  };
  const handleEditOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1, { ...newOptions[index], isDone: false });
    setOptions(newOptions);
  };
  const initOption = (initOptions: ProductOption[]) => {
    setOptions(
      initOptions.map((v) => ({
        ...v,
        isDone: true,
        values: v.values
          .filter(
            (v, index, self) =>
              self.findIndex((val) => val.value === v.value) === index
          )
          .sort((a, b) => {
            if (a.metadata?.stt !== undefined && b.metadata?.stt !== undefined)
              return (a.metadata.stt as number) - (b.metadata.stt as number);
            return 0;
          }),
      }))
    );
  };
  useEffect(() => {
    if (initOptionsStatus === "success") {
      if (isUpdatedProductOption) {
        setIsUpdatededProductOption(false);
      } else {
        initOption(initOptions);
      }
    }
  }, [initOptions, initOptionsStatus]);

  // Add an option
  const {
    mutate: createProductOption,
    isLoading: isLoadingCreateProductOption,
  } = useAdminCreateProductOption(product.id);
  const {
    mutate: deleteProductOption,
    isLoading: isLoadingDeleteProductOption,
  } = useAdminDeleteProductOption(product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdatedProductOption, setIsUpdatededProductOption] = useState(false);
  const { handleSubmit, reset, register, watch } = useForm<{ title: string }>();
  const handleDeleteOption = (id: string, toggleConfirm: () => void) => {
    deleteProductOption(id, {
      onSuccess: () => {
        const index = options.findIndex((opt) => opt.id === id);
        const newOptions = [...options];
        if (index !== -1) {
          newOptions.splice(index, 1);
        }
        setOptions(newOptions);
        setIsUpdatededProductOption(true);
        toggleConfirm();
      },
      onError: (error) => {
        notify.error(
          "Error",
          "Something went wrong, " + getErrorMessage(error)
        );
      },
    });
  };
  const onSubmitCreateProductOption = handleSubmit(async ({ title }) => {
    const isExsit = options.some((opt) => opt.title.trim() === title.trim());
    if (isExsit)
      return notify.error("Error", "Option " + title + " already exists!");
    createProductOption(
      { title },
      {
        onSuccess: (res) => {
          const createdOption = res.product.options.find(
            (option) => option.title === title
          );
          setIsUpdatededProductOption(true);
          setOptions([
            ...options,
            {
              id: createdOption.id,
              title,
              isDone: true,
              values: [{ value: title, option_id: createdOption.id }],
            },
          ]);
          reset();
          setIsAdding(false);
        },
        onError: (error) => {
          notify.error(
            "Error",
            "Something went wrong, " + getErrorMessage(error)
          );
        },
      }
    );
  });

  // Variant
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [filter, setFilter] = useState<{
    groupBy: string;
    filter: Map<string, string>;
  }>({
    groupBy: product?.options[0]?.id || null,
    filter: new Map(),
  });
  useEffect(() => {
    if (initOptionsStatus !== "success") return;

    // Trường hợp product chưa có groupBy
    if (
      filter.groupBy === null &&
      options.length > 0 &&
      options[0]?.values?.length > 0
    ) {
      setFilter({ ...filter, groupBy: options[0].id });
    }
    // Trường hợp tất cả option bị xoá
    if (options.length === 0) {
      setFilter({ ...filter, groupBy: null });
    }
  }, [options]);
  const [deletedVariants, setDeletedVariants] = useState<
    ProductVariantWithKey[]
  >([]);
  const [variants, setVariants] = useState<ProductVariantWithKey[]>(
    product.variants
  );
  const [variantGroups, setVariantGroups] = useState<TVariantGroups[]>([]);
  useEffect(() => {
    if (initOptionsStatus !== "success") return;

    const createdVariants = createVariants(options, product.title);

    const mergedVariantsWithOptions = mergeVariantsWithOptions(
      variants,
      createdVariants,
      options
    );

    setVariants(mergedVariantsWithOptions.mergedVariants);
    setDeletedVariants(mergedVariantsWithOptions.deletedVariants);
  }, [options, product]);

  useEffect(() => {
    const initVariantGroups: TVariantGroups[] = groupByVariants(
      variants,
      filter,
      options
    );
    setVariantGroups(initVariantGroups);
  }, [filter, variants]);
  const clearFilter = () => {
    setFilter({ ...filter, filter: new Map() });
  };

  // Table Variant
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isUploadMultiple, setIsUpdateMultiple] = useState(false);
  const [selectedRows, setSelectedRows] = useState<ProductVariantWithKey[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: ProductVariantWithKey[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const bulkModalRef = useRef<THandleEditFieldModal>(null);
  const bulkFunctions = [
    {
      name: "Edit SKUs",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () =>
        bulkModalRef.current.onOpen(
          true,
          ETypeBulkEditVariant.E_SKUs,
          "Edit SKUs"
        ),
    },
    {
      name: "Edit quantities",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () =>
        bulkModalRef.current.onOpen(
          true,
          ETypeBulkEditVariant.E_quantities,
          "Edit quantities"
        ),
    },
    {
      name: "Edit barcodes",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () =>
        bulkModalRef.current.onOpen(
          true,
          ETypeBulkEditVariant.E_Barcodes,
          "Edit barcodes"
        ),
    },
    {
      name: "Edit dimensions",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () =>
        bulkModalRef.current.onOpen(
          true,
          ETypeBulkEditVariant.E_Dimensions,
          "Edit dimensions"
        ),
    },
    {
      name: "Edit HS codes",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () =>
        bulkModalRef.current.onOpen(
          true,
          ETypeBulkEditVariant.E_HS_Codes,
          "Edit HS codes"
        ),
    },
    {
      name: "Edit thumbnail",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () => {
        setIsUpdateMultiple(false);
        setIsOpenUpload(true);
      },
    },
    {
      name: "Edit images",
      icon: <PencilSquare className="text-ui-fg-subtle" />,
      onClick: () => {
        setIsUpdateMultiple(true);
        setIsOpenUpload(true);
      },
    },
    {
      name: "Remove thumbnail",
      icon: <Trash className="text-ui-fg-subtle" />,
      onClick: () => onRemoveThumbnail(),
    },
    {
      name: "Remove images",
      icon: <Trash className="text-ui-fg-subtle" />,
      onClick: () => onRemoveImages(),
    },
    {
      name: "Delete variants",
      icon: <Trash className="text-ui-fg-subtle" />,
      onClick: () => onRemoveVariants(),
    },
  ];
  const onUpdateSelected = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
    setIsChange(true);
  };
  const onBulkSubmit = (values: any) => {
    if (values[ETypeBulkEditVariant.E_SKUs]) {
      const datas: { [key: string]: string } =
        values[ETypeBulkEditVariant.E_SKUs];
      const result = Object.entries(datas).map(([key, value]) => ({
        sku: value,
        key: key,
        isUpdated: true,
      }));
      setVariants(mergeVariants(variants, result));
    }
    if (values[ETypeBulkEditVariant.E_quantities]) {
      const datas: { [key: string]: number } =
        values[ETypeBulkEditVariant.E_quantities];
      const result = Object.entries(datas).map(([key, value]) => ({
        inventory_quantity: value,
        key: key,
        isUpdated: true,
      }));
      setVariants(mergeVariants(variants, result));
    }
    if (values[ETypeBulkEditVariant.E_Barcodes]) {
      const datas: { [key: string]: string } =
        values[ETypeBulkEditVariant.E_Barcodes];
      const result = Object.entries(datas).map(([key, value]) => ({
        barcode: value,
        key: key,
        isUpdated: true,
      }));
      setVariants(mergeVariants(variants, result));
    }
    if (values[ETypeBulkEditVariant.E_Dimensions]) {
      const datas: { [key: string]: string } =
        values[ETypeBulkEditVariant.E_Dimensions];
      const result = selectedRows.map((variant) => ({
        ...variant,
        ...datas,
        isUpdated: true,
      }));
      setVariants(mergeVariants(variants, result));
    }
    if (values[ETypeBulkEditVariant.E_HS_Codes]) {
      const datas: { [key: string]: string } =
        values[ETypeBulkEditVariant.E_HS_Codes];
      const result = selectedRows.map((variant) => ({
        ...variant,
        ...datas,
        isUpdated: true,
      }));
      setVariants(mergeVariants(variants, result));
    }
    onUpdateSelected();
  };
  const onUpload = (data: {
    media: { images: { url: string; selected: boolean }[] };
  }) => {
    if (isUploadMultiple) {
      const images: any[] = data.media.images
        .filter((image) => image.selected)
        .map((v) => v.url);
      const result = selectedRows.map((variant) => ({
        ...variant,
        images,
        isUpdatedImages: true,
      }));

      setVariants(mergeVariants(variants, result));
    } else {
      const thumbnail = data.media.images.find((image) => image.selected).url;
      const result = selectedRows.map((variant) => ({
        ...variant,
        thumbnail,
        isUpdated: true,
      }));

      setVariants(mergeVariants(variants, result));
    }
    onUpdateSelected();
    setIsOpenUpload(false);
  };
  const onRemoveThumbnail = () => {
    const result = selectedRows.map((variant) => ({
      ...variant,
      thumbnail: null,
      isUpdated: true,
    }));
    setVariants(mergeVariants(variants, result));
    onUpdateSelected();
  };
  const onRemoveImages = () => {
    const result = selectedRows.map((variant) => ({
      ...variant,
      isUpdatedImages: true,
      images: [],
    }));
    setVariants(mergeVariants(variants, result));
    onUpdateSelected();
  };
  const onRemoveVariants = () => {
    let newVariants = [...variants];
    const deletedVariantArr = [];
    const groupVariant = selectedRowKeys.filter((key: string) =>
      key.includes("-opt_")
    );

    if (groupVariant.length > 0) {
      const optionValues = groupVariant.map(
        (groupV: string) => groupV.split("-")[0]
      );

      newVariants = newVariants.filter((variant) => {
        const isValid = variant.options.every(
          (option) => !optionValues.includes(option.value)
        );
        if (!isValid) {
          deletedVariantArr.push(variant);
        }
        return isValid;
      });

      // Cập nhật lại mảng options
      const newOptions = [...options];
      groupVariant.forEach((group: string) => {
        const optionValue = group.split("-")[0];
        const optionId = group.split("-")[1];

        const indexOption = newOptions.findIndex((opt) => opt.id === optionId);

        if (indexOption !== undefined && indexOption !== -1) {
          if (newOptions[indexOption].values.length === 1) {
            newOptions.splice(indexOption, 1);
          } else {
            const newValues = newOptions[indexOption].values;
            const indexValues = newValues.findIndex(
              (v) => v.value === optionValue
            );
            newValues.splice(indexValues, 1);

            newOptions[indexOption].values = newValues;
          }
        }
      });

      setOptions(newOptions);
    }
    const result: ProductVariantWithKey[] = newVariants.map((variant) => {
      if (selectedRowKeys.includes(variant.key)) {
        return { ...variant, isDeleted: true } as ProductVariantWithKey;
      }
      return variant;
    });

    setVariants(result);
    setDeletedVariants([...deletedVariants, ...deletedVariantArr]);
    onUpdateSelected();
  };

  // Mutate data
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const { mutateAsync: mutateUpdateVariantCustom } = useAdminCustomPost(
    `/products-v2/${product.id}/variants/update`,
    ["bulk-update-variant"]
  );
  const { mutateAsync: mutateUpdateVariant } = useAdminUpdateVariant(
    product?.id
  );
  const { mutateAsync: mutateCreateVariant } = useAdminCustomPost(
    `/products-v2/${product.id}/variants/create`,
    ["bulk-create-variant"]
  );
  const { mutateAsync: mutateDeleteVariant } = useAdminDeleteVariant(
    product?.id
  );
  const onUpdate = async () => {
    setIsLoadingUpdate(true);

    const updateImageVariant: Partial<ProductVariant>[] = [];
    const updateVariant: Partial<ProductVariant>[] = [];
    const createVariant: ProductVariant[] = [];
    const deleteVariant: ProductVariant[] = variants.filter(
      (variant) => variant.isDeleted && !variant.isNew
    );

    variants.forEach((variant) => {
      if (variant?.isNew) {
        createVariant.push(
          omit(
            {
              manage_inventory: true,
              allow_backorder: false,
              inventory_quantity: 0,
              ...variant,
              options: variant.options.map((option) =>
                pick(option, ["option_id", "value", "metadata"])
              ),
            },
            [
              "isNew",
              "key",
              "keyTitle",
              "thumbnail",
              "images",
              "isDeleted",
              "isUpdatedImages",
              "isUpdated",
            ]
          ) as ProductVariant
        );
      } else {
        if (variant?.isUpdated) {
          updateVariant.push({
            id: variant.id,
            sku: variant.sku,
            inventory_quantity: variant.inventory_quantity,
            thumbnail: variant.thumbnail,
            barcode: variant.barcode,
            weight: variant.weight,
            length: variant.length,
            height: variant.height,
            width: variant.width,
            hs_code: variant.hs_code,
            options: variant.options.map(
              (option) =>
                ({
                  option_id: option.option_id,
                  value: option.value,
                  metadata: option?.metadata,
                } as any)
            ),
          });
        }
        if (variant?.isUpdatedImages) {
          updateImageVariant.push({
            id: variant.id,
            images: variant.images.map((image) => {
              if (typeof image === "string") return image;
              return image.url;
            }) as any,
          });
        }
      }
    });

    try {
      const result = await Promise.all([
        ...createVariant.map((variant) => mutateCreateVariant({ ...variant })),
        ...updateVariant.map((variant) => {
          const variant_id = variant.id;
          delete variant.id;
          return mutateUpdateVariantCustom({ variant_id, ...variant });
        }),
        ...updateImageVariant.map((variant) => {
          const variant_id = variant.id;
          delete variant.id;
          return mutateUpdateVariant({ variant_id, ...variant });
        }),
        [...deletedVariants, ...deleteVariant].map((variant) =>
          mutateDeleteVariant(variant.id)
        ),
      ]);

      setIsChange(false);
      notify.success("Success", "Update variants success");

      // Cập nhật lại isNew các variant mới
      const optionsId = options.map((opt) => opt.id);
      const createdKeySet = new Set(
        result
          .filter(
            (v: any) => !Array.isArray(v) && v.status === "Create successfully"
          )
          .map((v: any) => {
            const key = v.data.options
              .sort(
                (a: ProductOptionValue, b: ProductOptionValue) =>
                  optionsId.indexOf(a.option_id) -
                  optionsId.indexOf(b.option_id)
              )
              .map((opt: ProductOptionValue) => opt.value)
              .join(" / ");

            return key;
          })
      );
      if (createdKeySet.size === 0) return;

      const newVariant = variants.map((variant) => {
        if (createdKeySet.has(variant.key)) {
          variant.isNew = false;
        }
        return variant;
      });
      setVariants(newVariant);
    } catch (err) {
      notify.error("Error", "Something went wrong, " + getErrorMessage(err));
    }
    setIsLoadingUpdate(false);
  };

  // Bulk Edit
  const [isLoadingBulkEdit, setIsLoadingBulkEdit] = useState(false);
  const [isOpenBulkEdit, setIsOpenBulkEdit] = useState(false);
  const onBulkEdit = async (variants: ProductVariantWithKey[]) => {
    setIsLoadingBulkEdit(true);

    const updatedPromise = variants.map((variant) => {
      return mutateUpdateVariant({
        variant_id: variant.id,
        sku: variant.sku,
        material: variant.material,
        inventory_quantity: variant.inventory_quantity,
        barcode: variant.barcode,
        // weight: variant.weight,
        // length: variant.length,
        // height: variant.height,
        // width: variant.width,
        // hs_code: variant.hs_code,
        ean: variant.ean,
        upc: variant.upc,
        manage_inventory: variant.manage_inventory,
        allow_backorder: variant.allow_backorder,
        mid_code: variant.mid_code,
        origin_country: variant.origin_country,
      });
    });

    try {
      await Promise.all(updatedPromise);
      notify.success("Success", "Update variants success");

      setIsLoadingBulkEdit(false);
    } catch (err) {
      notify.error("Error", "Something went wrong, " + getErrorMessage(err));

      setIsLoadingBulkEdit(false);
    }

    setSelectedRows([]);
    setSelectedRowKeys([]);
    setIsOpenBulkEdit(false);
  };
  return (
    <>
      <Container title="Bulk Variants">
        <div className="w-full flex flex-wrap justify-between">
          <Heading
            level="h1"
            className="flex items-center justify-between gap-x-4 text-2xl font-semibold"
          >
            <div>Bulk Variants</div>
          </Heading>

          <div className="flex gap-x-2">
            {isChange && (
              <Button
                variant="danger"
                onClick={() => {
                  initOption(initOptions);
                  setVariants(product.variants);
                  setIsChange(false);
                  setSelectedRowKeys([]);
                  setSelectedRows([]);
                }}
              >
                Discard
              </Button>
            )}
            <Button
              disabled={!isChange}
              isLoading={isLoadingUpdate}
              variant="primary"
              onClick={onUpdate}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mt-2 flex flex-col divide-y-[1px] divide-gray-300">
            {options.map((option, index) => {
              return (
                <Options
                  productId={product.id}
                  initOptions={initOptions}
                  key={index}
                  index={index}
                  option={option}
                  loading={isLoadingDeleteProductOption}
                  handleDeleteOption={handleDeleteOption}
                  handleDoneOption={handleDoneOption}
                  handleEditOption={handleEditOption}
                  setIsUpdatededProductOption={setIsUpdatededProductOption}
                  options={options}
                  setOptions={setOptions}
                  notify={notify}
                />
              );
            })}
            {isAdding && (
              <form onSubmit={onSubmitCreateProductOption}>
                <div className="py-3">
                  <div className="flex flex-col gap-y-1">
                    <div className="flex justify-between items-center">
                      <Label>Add a product option</Label>
                      <IconButton
                        disabled={isLoadingCreateProductOption}
                        className="ml-auto"
                        onClick={() => setIsAdding(false)}
                      >
                        <XMark />
                      </IconButton>
                    </div>
                    <div className="flex gap-x-4 py-3">
                      <div className="flex-1">
                        <Input
                          disabled={isLoadingCreateProductOption}
                          {...register("title")}
                          placeholder="Add options like size or color"
                          size="small"
                        />
                      </div>
                      <IconButton
                        isLoading={isLoadingCreateProductOption}
                        disabled={!watch("title", "")}
                        type="submit"
                      >
                        <Check />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
          {!isAdding && (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <div className="mt-2 cursor-pointer items-center px-1 py-2 flex hover:underline hover:decoration-blue-500">
                  <Plus color="#1d4ed8" />
                  <span className="text-blue-700">
                    Add options like size or color
                  </span>
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {product.options
                  .filter((v) => !options.some((option) => option.id === v.id))
                  .map((option) => (
                    <DropdownMenu.Item
                      onClick={() =>
                        setOptions([
                          ...options,
                          {
                            isDone: false,
                            id: option.id,
                            title: option.title,
                            values: [
                              { value: option.title, option_id: option.id },
                            ],
                          },
                        ])
                      }
                      className="gap-x-2"
                    >
                      {option.title}
                    </DropdownMenu.Item>
                  ))}
                <DropdownMenu.Item
                  onClick={() => setIsAdding(true)}
                  className="gap-x-2"
                >
                  <Plus /> Add an option
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          )}
        </div>
        {options.length > 0 && (
          <>
            <div className="mt-4 pt-5 border-t-[1px] border-t-gray-300">
              <div className="flex justify-between mb-6">
                <div className="flex items-center gap-x-2">
                  <Label>Group by</Label>
                  <Select
                    className="w-[130px]"
                    onChange={(v) => setFilter({ ...filter, groupBy: v })}
                    value={filter?.groupBy}
                  >
                    {options.map((option) => {
                      return (
                        <Select.Option key={option.id} value={option.id}>
                          {option.title}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="flex gap-x-2">
                  <IconButton
                    onClick={() => {
                      if (isShowFilter) {
                        clearFilter();
                      }
                      setIsShowFilter(!isShowFilter);
                    }}
                  >
                    {isShowFilter ? <XMark /> : <Funnel />}
                  </IconButton>
                  {selectedRows.length > 0 && (
                    <>
                      <div>
                        <Button
                          onClick={() => setIsOpenBulkEdit(true)}
                          variant="secondary"
                          disabled={
                            selectedRows.some((row) => row.isNew) || isChange
                          }
                        >
                          <PencilSquare className="text-ui-fg-subtle" /> Bulk
                          edit
                        </Button>
                      </div>
                      <div className="flex flex-col items-center gap-y-2">
                        <DropdownMenu>
                          <DropdownMenu.Trigger asChild>
                            <IconButton>
                              <EllipsisHorizontal />
                            </IconButton>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            {bulkFunctions.map((item, index) => (
                              <DropdownMenu.Item
                                onClick={item.onClick}
                                key={index}
                                className="gap-x-2"
                              >
                                {item.icon}
                                {item.name}
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {isShowFilter && (
                <div className="flex gap-y-4 mb-4 flex-wrap mx-[-4px]">
                  {options.map((option) => {
                    return (
                      <div
                        key={option.id}
                        className="flex items-center w-1/4 px-[4px]"
                      >
                        <Select
                          className="w-full"
                          allowClear
                          value={filter.filter.get(option.id)}
                          placeholder={option.title}
                          onChange={(v) =>
                            setFilter({
                              ...filter,
                              filter: filter.filter.set(option.id, v),
                            })
                          }
                        >
                          {option.values.map((value) => {
                            return (
                              <Select.Option key={value.id} value={value.value}>
                                {value.value}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </div>
                    );
                  })}
                  {filterUndefinedValues(filter.filter) > 0 && (
                    <div className="w-1/4 px-[4px]">
                      <Button onClick={clearFilter} variant="transparent">
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <BulkTable
              setIsChange={setIsChange}
              onSelectChange={onSelectChange}
              selectedRowKeys={selectedRowKeys}
              variants={variants}
              setVariants={setVariants}
              variantGroups={variantGroups}
              product={product}
              notify={notify}
            />
          </>
        )}
      </Container>
      <EditFieldModal
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
        onSubmit={onBulkSubmit}
        ref={bulkModalRef}
      />
      <BulkEditVariantModal
        onUpdate={onBulkEdit}
        isLoadingBulkEdit={isLoadingBulkEdit}
        variants={selectedRows}
        onClose={() => setIsOpenBulkEdit(false)}
        open={isOpenBulkEdit}
      />
      <BulkVariantsModal
        onUpload={onUpload}
        notify={notify}
        type={isUploadMultiple ? "media" : "thumbnail"}
        product={product}
        variants={variants}
        open={isOpenUpload}
        onClose={() => setIsOpenUpload(false)}
      />
    </>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.after",
};

export default BulkEditVariantWidget;
