import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
type BaseSettingPaddingProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingPadding: FC<BaseSettingPaddingProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>Padding</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("padding");
          }}
        >
          {!!currentBlock?.data?.padding ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.padding && (
        <div className="w-full grid grid-cols-4 gap-2">
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.padding?.top}
            name="padding.top"
            label="top"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.padding?.right}
            name="padding.right"
            label="right"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.padding?.bottom}
            name="padding.bottom"
            label="bottom"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.padding?.left}
            name="padding.left"
            label="left"
            type="number"
            suffix="px"
          />
        </div>
      )}
    </div>
  );
};
export default BaseSettingPadding;
