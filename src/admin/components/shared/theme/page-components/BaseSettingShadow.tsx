import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
type BaseSettingShadowProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingShadow: FC<BaseSettingShadowProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>shadow</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("shadow");
          }}
        >
          {!!currentBlock?.data?.shadow ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.shadow && (
        <div className="w-full grid grid-cols-4 gap-2">
          <InputField
            id="browsers"
            onChange={handleChangeData}
            name="shadow.horizontal"
            value={currentBlock?.data?.shadow?.horizontal}
            label="Horizontal offset"
            type="number"
            min={-12}
            max={12}
            suffix="px"
          />
          <datalist id="browsers">
            <option value="Edge" />
            <option value="Firefox" />
            <option value="Chrome" />
            <option value="Opera" />
            <option value="Safari" />
          </datalist>
          <InputField
            onChange={handleChangeData}
            name="shadow.vertical"
            value={currentBlock?.data?.shadow?.vertical}
            label="Vertical offset"
            type="number"
            min={-12}
            max={12}
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="shadow.blur"
            value={currentBlock?.data?.shadow?.blur}
            label="Blur"
            type="number"
            min={-12}
            max={12}
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="shadow.opacity"
            value={currentBlock?.data?.shadow?.opacity}
            label="opacity"
            type="number"
            suffix="%"
            min={0}
            max={100}
          />
        </div>
      )}

      
    </div>
  );
};
export default BaseSettingShadow;
