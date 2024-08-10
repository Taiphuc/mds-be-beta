import type { ProductDetailsWidgetProps } from "@medusajs/admin";
import { ProductOptionValue } from "@medusajs/medusa";
import { FC, useEffect, useRef, useState } from "react";
import InputField from "../input";
import Button from "../shared/button";
import Dropdown from "./Dropdown";
import { useOptionsContext } from "./options-provider";
type EditOptionValueModalProps = {
  onClose: () => void;
  optionvalue: ProductOptionValue;
} & ProductDetailsWidgetProps;
const EditOptionValueModal: FC<EditOptionValueModalProps> = ({
  onClose,
  optionvalue,
  notify,
}) => {
  const BACKEND_URL = process.env.MEDUSA_ADMIN_BE_URL;
  const [metadata, setMetadata] = useState(null);
  const { refetch, options } = useOptionsContext();
  const [focusedInput, setFocusedInput] = useState(null);
  const keyInputRef = useRef(null);
  const valueInputRef = useRef(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const handleInputChange = (e, index, field) => {
    const newMetadata = [...metadata];

    if (field === "key") {
      newMetadata[index].key = e.target.value;
    } else {
      newMetadata[index].value = e.target.value;
    }
    setMetadata(newMetadata);
  };

  const handleInitialInputChange = (e) => {
    if (focusedInput === "keyInput") {
      setMetadata([{ key: e.target.value, value: "" }]);
    } else if (focusedInput === "valueInput") {
      setMetadata([{ key: "", value: e.target.value }]);
    }
  };

  const submitChange = async (e) => {
    e.preventDefault();
    let hasEmptyKeyOrValue = false;
    let optionvaluesId = [];

    if (metadata !== null) {
      const isEmpty = (str) => typeof str === "string" && str.trim() === "";
      hasEmptyKeyOrValue = metadata.some(
        ({ key, value }) => isEmpty(key) || isEmpty(value)
      );
    }
    if (hasEmptyKeyOrValue) {
      return notify.warn(
        "Warning",
        "A key or value is empty. Please delete the empty entry or populate it."
      );
    }

    options.map((option) => {
      return option.values?.map((val, index) => {
        if (val.value === optionvalue.value) {
          optionvaluesId.push(val.id);
        }
      });
    });

    for (let i = 0; i < optionvaluesId.length; i++) {
      try {
        const response = await fetch(
          `${BACKEND_URL}/admin/product-option-values/${optionvaluesId[i]}/metadata`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metadata:
                metadata !== null
                  ? metadata.reduce((acc, { key, value }) => {
                      acc[key] = value;
                      return acc;
                    }, {})
                  : null,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Received an error response from the server.");
        }

        const data = await response.json();
        notify.success("success", `Metadata has been updated!`);
        refetch();
      } catch (error) {
        notify.error("Error", "Something went wrong\b" + error);
      }
    }
  };

  useEffect(() => {
    if (optionvalue.metadata !== null) {
      setMetadata(
        Object.entries(optionvalue.metadata).map(([key, value]) => ({
          key,
          value,
        }))
      );
    } else {
      setMetadata(null);
    }
  }, [optionvalue]);

  useEffect(() => {
    if (metadata !== null) {
      if (focusedInput === "keyInput" && keyInputRef.current) {
        keyInputRef.current.focus();
        setFocusedInput(null);
      } else if (focusedInput === "valueInput" && valueInputRef.current) {
        valueInputRef.current.focus();
        setFocusedInput(null);
      }
    }
  }, [metadata, focusedInput]);
  return (
    <div className="pt-5">
      <form onSubmit={submitChange}>
        <div className="w-full flex flex-col">
          {metadata !== null ? (
            metadata.map(({ key, value }, index) => (
              <div key={index} className="grid grid-cols-3">
                <div>
                  <InputField
                    ref={keyInputRef}
                    name={`metadata.${index}.key`}
                    placeholder="Key"
                    value={metadata[index].key}
                    onChange={(e) => handleInputChange(e, index, "key")}
                    className=""
                  />
                </div>
                <div>
                  <InputField
                    ref={valueInputRef}
                    name={`metadata.${index}.value`}
                    placeholder="Value"
                    value={metadata[index].value}
                    onChange={(e) => handleInputChange(e, index, "value")}
                    className=""
                  />
                </div>
                <div
                  className={`flex justify-end items-center group-hover:visible ${
                    openDropdownIndex === index ? "visible" : "invisible"
                  }`}
                >
                  <Dropdown
                    metadata={metadata}
                    setMetadata={setMetadata}
                    index={index}
                    notify={notify}
                    setOpenDropdownIndex={setOpenDropdownIndex}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className=" grid grid-cols-3">
              <div>
                <InputField
                  name="metadata.0.key"
                  placeholder="Key"
                  onChange={(e) => handleInitialInputChange(e)}
                  onFocus={() => setFocusedInput("keyInput")}
                  className=""
                />
              </div>
              <div>
                <InputField
                  name="metadata.0.value"
                  placeholder="Value"
                  onChange={(e) => handleInitialInputChange(e)}
                  onFocus={() => setFocusedInput("valueInput")}
                  className=""
                />
              </div>
              <div
                className={`flex justify-end items-center group-hover:visible ${
                  openDropdownIndex === 0 ? "visible" : "invisible"
                }`}
              >
                <Dropdown
                  metadata={metadata}
                  setMetadata={setMetadata}
                  index={0}
                  notify={notify}
                  setOpenDropdownIndex={setOpenDropdownIndex}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-x-3 mt-base">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-2.5 py-1"
          >
            Cancel
          </Button>
          <Button type="submit" className="px-2.5 py-1" variant="primary">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
};
export default EditOptionValueModal;
