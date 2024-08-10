import { Eye, PlusMini } from "@medusajs/icons";
import {
  ProductOption,
  ProductOptionValue,
  ProductVariant,
} from "@medusajs/medusa";
import { Button, IconButton, Label } from "@medusajs/ui";
import { Image, Tag } from "antd";
import { ProductVariantWithKey, TOption } from "../bulk-edit-variant";

const createKeyFromOptions = (options: ProductOptionValue[]) => {
  return options
    .map((option) => option.value)
    .sort()
    .join("/");
};
const normalizeString = (str: string) => {
  return str
    .split(" / ")
    .map((word) => word.trim())
    .sort()
    .join(" / ");
};
const filterUndefinedValues = (map: Map<string, string>) => {
  const newMap = new Map();
  for (const [key, value] of map) {
    if (value !== undefined) {
      newMap.set(key, value);
    }
  }
  return newMap.size;
};

const groupByVariants = (
  variants: ProductVariant[],
  { groupBy, filter }: { groupBy: string; filter: Map<string, string> },
  options: TOption[]
) => {
  const result = [];
  let filteredVariants = variants;
  if (filter.size > 0) {
    filteredVariants = variants.filter((variant) => {
      return Array.from(filter.entries()).every(([key, value]) => {
        if (value === undefined) {
          return true;
        }
        const option = variant.options.find((opt) => opt.option_id === key);

        return option && option.value === value;
      });
    });
  }

  filteredVariants.forEach((variant) => {
    variant.options.forEach((option) => {
      if (option.option_id === groupBy) {
        const key = `${option.value}-${option.option_id}`;
        if (!result[key]) {
          result[key] = [variant];
        } else {
          result[key].push(variant);
        }
      }
    });
  });
  return Object.entries(result).map(([key, value]) => {
    const option = key.split("-");
    const valueOption = option[0];
    const idOption = option[1];

    const inventory_quantity = value.reduce(
      (total: number, curr: ProductVariant) => {
        return (total += Number(curr.inventory_quantity || 0));
      },
      0
    );

    const isNew = value.some((v: ProductVariantWithKey) => v.isNew);

    const optionsId = options.map((v) => v.id);
    const children: (ProductVariant & { key: string })[] = value.map(
      (variant: ProductVariant) => {
        const variantKeyTitle: string = variant.options
          .filter((opt) => opt.option_id !== groupBy)
          .sort(
            (a, b) =>
              optionsId.indexOf(a.option_id) - optionsId.indexOf(b.option_id)
          )
          .map((opt) => opt.value)
          .join(" / ");
        return {
          ...variant,
          keyTitle: variantKeyTitle,
        };
      }
    );
    const isParent = children.length > 0 && children[0].options.length > 1;
    if (isParent) {
      return {
        key,
        isNew,
        idOption,
        title: valueOption,
        inventory_quantity,
        children,
      };
    }
    return {
      key,
      ...children[0],
      isNew,
      idOption,
      title: valueOption,
      inventory_quantity,
    } as any;
  });
};

const createVariants = (
  options: TOption[],
  productTitle: string
): ProductVariantWithKey[] => {
  // Hàm tạo tổ hợp từ các mảng con
  const getCombinations = (
    optionArr: Partial<ProductOption>[][]
  ): ProductOptionValue[][] => {
    if (optionArr.length === 0) return [[]];
    const result = [];
    const allCasesOfRest = getCombinations(optionArr.slice(1));
    for (let i = 0; i < allCasesOfRest.length; i++) {
      for (let j = 0; j < optionArr[0].length; j++) {
        result.push([optionArr[0][j], ...allCasesOfRest[i]]);
      }
    }
    return result;
  };

  // Lấy tất cả các giá trị của các options
  const optionValues = options.map((option) => option.values);

  // Tạo tất cả các tổ hợp
  const combinations = getCombinations(optionValues);
  // Tạo các variants từ các tổ hợp
  const variants: ProductVariantWithKey[] = combinations.map((combination) => {
    const variantTitle: string = combination
      .map((opt) => opt.value)
      .join(" / ");

    const isUpdated = combination.some((option: any) => option.isUpdate);

    return {
      title: `${productTitle} - ${variantTitle}`,
      prices: [],
      options: combination,
      isUpdated,
    } as ProductVariantWithKey;
  });

  return variants;
};

const mergeVariantsWithOptions = (
  defaultVariants: ProductVariant[],
  createdVariants: ProductVariantWithKey[],
  options: TOption[]
): {
  mergedVariants: ProductVariantWithKey[];
  deletedVariants: ProductVariantWithKey[];
} => {
  const optionsId = options.map((option) => option.id);
  const removedVariants = [];
  const defaultArr = new Set(
    defaultVariants
      .filter((variant) => {
        if (variant.options.length !== options.length) {
          removedVariants.push(variant);
          return false;
        }

        const variantsDefaultKey = variant.options.map(
          (option) => `${option.option_id}-${option.value}`
        );
        const optionsKeys = options.flatMap((option) =>
          option.values.map((value) => `${option.id}-${value.value}`)
        );

        const isValid = variantsDefaultKey.every((key) =>
          optionsKeys.includes(key)
        );
        if (!isValid) {
          removedVariants.push(variant);
        }
        return isValid;
      })
      // Update variant khi option đc update
      // .map((variant) => {
      //   const variantsDefaultKey = variant.options.map(
      //     (option) => `${option.option_id}-${option.value}`
      //   );
      //   const optionsKeys = options.flatMap((option) =>
      //     option.values.map((value) => `${option.id}-${value.value}`)
      //   );

      //   const isValid = variantsDefaultKey.every((key) =>
      //     optionsKeys.includes(key)
      //   );
      //   if (!isValid) {
      //     const updatedOption = options
      //       .flatMap((option) => option.values)
      //       .find((optionValue) => {
      //         const variantOptionValue = variant.options.find(
      //           (v) => v?.id === optionValue?.id
      //         );
      //         return (
      //           optionValue?.id === variantOptionValue?.id &&
      //           optionValue.value !== variantOptionValue.value
      //         );
      //       });
      //       "🚀 ~ .map ~ flatMap:",
      //       options.flatMap((option) => option.values)
      //     );
      //     if (!updatedOption) return variant;
      //     const newOptions = [...variant.options];
      //     const index = newOptions.findIndex(
      //       (v) => v?.id === updatedOption?.id
      //     );
      //     if (index !== -1) {
      //       newOptions.splice(index, 1, updatedOption as ProductOptionValue);
      //     }
      //     return { ...variant, options: newOptions };
      //   }
      //   return variant;
      // })
      // Update metadata
      .map((variant) => {
        const createdVariant: ProductVariantWithKey = createdVariants.find(
          (v) => {
            return (
              createKeyFromOptions(variant.options) ===
              createKeyFromOptions(v.options)
            );
          }
        );

        return {
          ...variant,
          options: variant.options.map((option) => {
            const createdOption = createdVariant?.options.find(
              (o) => o.value === option.value
            );
            return {
              value: option.value,
              option_id: option.option_id,
              id: option.id,
              metadata:
                option?.metadata || createdOption?.metadata
                  ? { ...option?.metadata, ...createdOption?.metadata }
                  : null,
            };
          }),
          isUpdated: !!createdVariant?.isUpdated,
          key: variant.options
            .sort(
              (a, b) =>
                optionsId.indexOf(a.option_id) - optionsId.indexOf(b.option_id)
            )
            .map((opt) => opt.value)
            .join(" / "),
        };
      })
  );

  const createdArr = new Set(
    createdVariants.map((variant) => ({
      ...variant,
      options: variant.options.map((option) => ({
        value: option.value,
        option_id: option.option_id,
        metadata: option?.metadata || null,
      })),
      key: variant.options
        .sort(
          (a, b) =>
            optionsId.indexOf(a.option_id) - optionsId.indexOf(b.option_id)
        )
        .map((opt) => opt.value)
        .join(" / "),
    }))
  );
  const missingElements: any[] = [];

  for (const element of createdArr) {
    let found = false;
    for (const item of defaultArr) {
      if (item.key === element.key) {
        found = true;
        break;
      }
    }
    if (!found) {
      missingElements.push({ ...element, isNew: true });
    }
  }
  for (const element of missingElements) {
    defaultArr.add(element);
  }

  return {
    mergedVariants: Array.from(defaultArr) as any[],
    deletedVariants: removedVariants,
  };
};
const mergeVariants = (
  defaultVariants: ProductVariantWithKey[],
  updatedVariants: Partial<ProductVariantWithKey>[]
): ProductVariantWithKey[] => {
  const updatedMap = new Map(
    updatedVariants.map((variant) => [variant.key, variant])
  );

  return defaultVariants.map((variant) => {
    const updatedVariant = updatedMap.get(variant.key);
    if (updatedVariant) {
      return { ...variant, ...updatedVariant } as ProductVariantWithKey;
    }
    return variant;
  });
};

type TColumnsF = {
  onOpenUpload: (v: string, isChildren: boolean) => void;
  onUndo: (key: string) => void;
  viewVariantRef: any;
};
const columnsF = ({ onOpenUpload, onUndo, viewVariantRef }: TColumnsF) => {
  const AddImage = ({
    variantKey,
    isChildren,
    url,
  }: {
    variantKey: string;
    isChildren: boolean;
    url?: string;
  }) => {
    return (
      <div
        className="cursor-pointer"
        onClick={() => {
          onOpenUpload(variantKey, isChildren);
        }}
      >
        {url ? (
          <Image
            style={{ objectFit: "contain" }}
            preview={false}
            src={url}
            width={50}
            height={50}
          />
        ) : (
          <div className="w-[50px] h-[50px] border-[1px] rounded border-dashed border-gray-300 flex items-center justify-center hover:border-sky-500 transition-colors duration-300">
            <PlusMini color="#0ea5e9" />
          </div>
        )}
      </div>
    );
  };

  return [
    {
      title: "Variant",
      key: "variant",
      dataIndex: "variant",
      render: (
        _: any,
        record: ProductVariantWithKey & {
          children: ProductVariantWithKey[];
        }
      ) => {
        let imageGroup = null;
        if (record?.children)
          record.children.every((v) => {
            if (v?.thumbnail) {
              imageGroup = v.thumbnail;
              return false;
            }
          });

        return record.children ? (
          <div className="flex gap-x-2">
            <AddImage
              url={imageGroup}
              variantKey={record.key}
              isChildren={false}
            />
            <div className="flex flex-col">
              <Label className="flex items-center">
                {record.title}{" "}
                {record?.isNew && (
                  <span className="ml-[4px] d-inline-block w-[6px] h-[6px] bg-sky-500 rounded-full" />
                )}
              </Label>
              <Label>{record.children?.length} variants</Label>
            </div>
          </div>
        ) : (
          <div className="flex gap-x-2">
            <AddImage
              url={record?.thumbnail}
              variantKey={record.key}
              isChildren={!!record.children?.length}
            />
            <div className="flex flex-col">
              <Label
                className={`${
                  record?.isDeleted && "line-through"
                } flex gap-x-2 items-center`}
              >
                {record?.keyTitle || record.title}{" "}
                {record?.isNew && <Tag color="blue">New</Tag>}
              </Label>
              <Label className={`${record?.isDeleted && "line-through"}`}>
                {record?.sku || "--"}
              </Label>
            </div>
          </div>
        );
      },
    },
    {
      title: "Available",
      key: "inventory_quantity",
      dataIndex: "inventory_quantity",
      render: (v: number, record: ProductVariantWithKey) => {
        if (record.isDeleted) {
          return (
            <div className="flex gap-x-2 items-center">
              <Label className="text-grey-300">
                This variant won't be created
              </Label>
              <Button
                className="text-sky-500"
                variant="transparent"
                onClick={() => onUndo(record.key)}
              >
                Undo
              </Button>
            </div>
          );
        }
        return v && !isNaN(v) ? v : "--";
      },
    },
    {
      title: "View",
      key: "view",
      dataIndex: "view",
      render: (
        _: null,
        record: ProductVariantWithKey & {
          children: ProductVariantWithKey[];
        }
      ) => {
        if (record.children) return <div>--</div>;
        return (
          <IconButton
            onClick={() => viewVariantRef.current?.onOpen(true, record)}
            disabled={record?.isDeleted}
          >
            <Eye />
          </IconButton>
        );
      },
    },
  ];
};

const removeFields = (obj: any, fieldsToRemove: string[]) => {
  fieldsToRemove.forEach((field) => delete obj[field]);
};

export {
  columnsF,
  createVariants,
  filterUndefinedValues,
  groupByVariants,
  mergeVariants,
  mergeVariantsWithOptions,
  normalizeString,
  removeFields,
};
