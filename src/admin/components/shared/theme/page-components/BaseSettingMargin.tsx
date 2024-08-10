import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
type BaseSettingMarginProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingMargin: FC<BaseSettingMarginProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>Margin</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("margin");
          }}
        >
          {!!currentBlock?.data?.margin ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.margin && (
        <div className="w-full grid grid-cols-4 gap-2">
          <InputField
            onChange={handleChangeData}
            name="margin.top"
            value={currentBlock?.data?.margin?.top}
            label="top"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="margin.right"
            value={currentBlock?.data?.margin?.right}
            label="right"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="margin.bottom"
            value={currentBlock?.data?.margin?.bottom}
            label="bottom"
            type="number"
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="margin.left"
            value={currentBlock?.data?.margin?.left}
            label="left"
            type="number"
            suffix="px"
          />
        </div>
      )}
    </div>
  );
};
export default BaseSettingMargin;
