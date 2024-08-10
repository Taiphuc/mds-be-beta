import { Check, Pencil, Trash, XMark } from "@medusajs/icons";
import { Product, ProductOptionValue } from "@medusajs/medusa";
import {
  Badge,
  Button,
  IconButton,
  Input,
  Label,
  Text,
  useToggleState,
} from "@medusajs/ui";
import { useAdminUpdateProductOption } from "medusa-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useForm } from "react-hook-form";
import ConfirmModal from "../../../components/modal/confirm-modal";
import { TOption } from "../bulk-edit-variant";
import { Notify } from "../../../components/types/extensions";
import { ColorPicker } from "antd";

type TOptions = {
  options: TOption[];
  option: TOption & Partial<ProductOptionValue>;
  handleDeleteOption: (id: string, toggleConfirm: () => void) => void;
  handleDoneOption: (value: TOption, index: number) => void;
  handleEditOption: (index: number) => void;
  setOptions: (v: TOption[]) => void;
  setIsUpdatededProductOption: (v: boolean) => void;
  index: number;
  loading: boolean;
  productId: string;
  initOptions: TOption[];
  notify: Notify;
};

const ItemTypes = {
  ITEM: "item",
};

type TDraggableItem = {
  length: number;
  item: Partial<ProductOptionValue & { isError: boolean; isUpdate: boolean }>;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>, i: number) => void;
  onChangeValue: (
    index: number,
    e?: React.ChangeEvent<HTMLInputElement>,
    color?: string
  ) => void;
  handleDeleteValue: (index: number) => void;
  option: TOption & Partial<ProductOptionValue>;
};
const DraggableItem = ({
  length,
  item,
  index,
  moveItem,
  onBlur,
  onChangeValue,
  handleDeleteValue,
  option,
}: TDraggableItem) => {
  const isColorOption = option.title.trim().toLocaleLowerCase() === "color";
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover(draggedItem: any) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (index === length - 1 && item.value === "") {
        return;
      }

      if (dragIndex === hoverIndex) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="flex gap-x-3 items-center cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex-1">
        <Input
          placeholder="Add another value"
          type="text"
          className={`${item.isError && "border-[1px] border-red-500"}`}
          value={item.value}
          onChange={(e) => onChangeValue(index, e)}
          onBlur={(e) => onBlur(e, index)}
        />
      </div>
      {isColorOption && (
        <div className="w-[32px] h-[32px]">
          <ColorPicker
            value={
              (item.metadata?.hex as string) || item.value.trim().toLowerCase()
            }
            onChange={(_, hex) => onChangeValue(index, undefined, hex)}
          />
        </div>
      )}
      <div className="w-[32px] h-[32px]">
        {!(length > 1 && index === length - 1 && item.value === "") && length > 1 && (
          <IconButton
            onClick={() => {
              handleDeleteValue(index);
            }}
          >
            <Trash />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default function Options({
  option,
  index,
  productId,
  initOptions,
  loading,
  handleDeleteOption,
  handleDoneOption,
  handleEditOption,
  options,
  setOptions,
  setIsUpdatededProductOption,
  notify,
}: TOptions) {
  const deletable = useMemo(() => {
    if (!initOptions || !option) return false;
    const initOption = initOptions.find((opt) => opt.id === option.id);

    return initOption?.values?.length === 0;
  }, [[initOptions, option]]);

  const { state: isConfirm, toggle: toggleConfirm } = useToggleState();
  const [values, setValues] = useState<
    Partial<ProductOptionValue & { isError: boolean; isUpdate: boolean }>[]
  >([]);

  useEffect(() => {
    setValues([...option.values, { value: "" }]);
  }, [option]);

  const onChangeValue = (
    index: number,
    e?: React.ChangeEvent<HTMLInputElement>,
    color?: string
  ) => {
    const newValues = [...values];
    if (color) {
      const metadata = {
        ...option?.metadata,
        hex: color,
      };
      newValues.splice(index, 1, {
        ...newValues[index],
        option_id: option.id,
        isUpdate: true,
        metadata,
      });
    } else {
      newValues.splice(index, 1, {
        ...newValues[index],
        value: e.target.value,
        option_id: option.id,
      });
    }

    setValues(newValues);

    if (index === values.length - 1 && e.target.value !== "") {
      setValues([...newValues, { value: "", option_id: option.id }]);
    }
  };
  const onBlur = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const newValues = [...values];
    if (
      newValues.some(
        (v, index) => !v.isError && index !== i && v.value === e.target.value
      )
    ) {
      newValues.splice(i, 1, { ...newValues[i], isError: true });
    } else {
      newValues.splice(i, 1, { ...newValues[i], isError: false });
    }
    setValues(newValues);
  };
  const handleDeleteValue = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
  };
  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedValues = [...values];
    const [movedItem] = updatedValues.splice(fromIndex, 1);
    updatedValues.splice(toIndex, 0, { ...movedItem, isUpdate: true });

    if (fromIndex < toIndex) {
      updatedValues[toIndex - 1] = {
        ...updatedValues[toIndex - 1],
        isUpdate: true,
      };
    } else {
      updatedValues[toIndex + 1] = {
        ...updatedValues[toIndex + 1],
        isUpdate: true,
      };
    }

    setValues(updatedValues);
  };

  // Edit title
  const { handleSubmit, reset, register } = useForm<{ title: string }>();
  const {
    mutate: updateProductOption,
    isLoading: isLoadingupdateProductOption,
  } = useAdminUpdateProductOption(productId);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const handleUpdateOption = handleSubmit(({ title }) => {
    const isExsit = options.some((opt) => opt.title.trim() === title?.trim());
    if (isExsit)
      return notify.error("Error", "Option " + title + " already exists!");

    updateProductOption(
      { option_id: option.id, title },
      {
        onSuccess: () => {
          const newOptions = [...options];
          if (index !== -1) {
            newOptions.splice(index, 1, { ...option, title });
          }
          setOptions(newOptions);
          setIsUpdatededProductOption(true);
          setIsEditTitle(false);
          reset();
        },
      }
    );
  });

  const doneOption = () => {
    const uniqueMap = new Map();
    const result = values
      .filter((v) => !v.isError)
      .filter((v) => v.value !== "");
    result.forEach((v, i) => {
      delete v.isError;
      const metadata = {
        ...option?.metadata,
        stt: i,
        hex: v.metadata?.hex || v.value.trim().toLocaleLowerCase(),
      };
      if (option.title.trim().toLocaleLowerCase() !== "color") {
        delete metadata.hex;
      }
      uniqueMap.set(v.value, {
        ...v,
        metadata,
      });
    });

    setIsEditTitle(false);
    handleDoneOption({ ...option, values: [...uniqueMap.values()] }, index);
  };

  return (
    <>
      {!!option?.isDone ? (
        <div
          onClick={() => handleEditOption(index)}
          className="cursor-pointer py-3 flex flex-col hover:bg-grey-10"
        >
          <div className="mb-2">
            <Text weight="plus">{option.title}</Text>
          </div>
          <div className="flex gap-2 flex-wrap">
            {option.values.map((v, i) => (
              <Badge key={i}>{v.value}</Badge>
            ))}
          </div>
        </div>
      ) : (
        <div key={index} className="py-3 flex flex-col gap-y-2">
          <div>
            <Label>Option name</Label>
            <form onSubmit={handleUpdateOption}>
              <div className="flex gap-x-3 items-center">
                <div className="flex-1">
                  <Input
                    {...register("title")}
                    disabled={!isEditTitle || isLoadingupdateProductOption}
                    placeholder="Option name"
                    type="text"
                    defaultValue={option.title}
                  />
                </div>
                <div className="min-w-[32px]">
                  {isEditTitle ? (
                    <div className="flex gap-x-2 items-center">
                      <IconButton
                        type="submit"
                        isLoading={isLoadingupdateProductOption}
                      >
                        <Check />
                      </IconButton>
                      <XMark
                        className="cursor-pointer"
                        onClick={() => setIsEditTitle(false)}
                      />
                    </div>
                  ) : (
                    <Pencil
                      className="cursor-pointer"
                      onClick={() => setIsEditTitle(true)}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col gap-y-2 py-3">
            <Label>Option values</Label>
            <DndProvider backend={HTML5Backend}>
              {values.map((value, i) => (
                <DraggableItem
                  option={option}
                  length={values.length}
                  key={i}
                  item={value}
                  index={i}
                  moveItem={moveItem}
                  onBlur={onBlur}
                  onChangeValue={onChangeValue}
                  handleDeleteValue={handleDeleteValue}
                />
              ))}
            </DndProvider>
          </div>
          <div className="flex justify-between">
            <Button
              disabled
              variant="danger"
              onClick={() => {
                if (
                  values.filter((v) => v.value !== "").length > 0 ||
                  !deletable
                ) {
                  notify.warn(
                    "Warning",
                    "You should delete all option values and click Save before deleting this option."
                  );
                  return;
                }
                toggleConfirm();
              }}
            >
              Delete
            </Button>
            <Button variant="secondary" onClick={doneOption}>
              Done
            </Button>
          </div>
        </div>
      )}
      <ConfirmModal
        loading={loading}
        description="Are you sure? This action cannot be undone."
        title="Delete option"
        cancelText="Cancel"
        okText="Delete"
        action={() => handleDeleteOption(option.id, toggleConfirm)}
        open={isConfirm}
        toggle={toggleConfirm}
      />
    </>
  );
}
