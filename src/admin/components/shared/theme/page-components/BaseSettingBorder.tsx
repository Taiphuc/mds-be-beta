import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
type BaseSettingBorderProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingBorder: FC<BaseSettingBorderProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>Border</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("border");
          }}
        >
          {!!currentBlock?.data?.border ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.border && (
        <div className="w-full grid grid-cols-3  gap-2">
          <InputField
            onChange={handleChangeData}
            name="border.width"
            value={currentBlock?.data?.border?.width}
            label="width"
            type="number"
            min={0}
            suffix="px"
          />
          <InputField
            onChange={handleChangeData}
            name="border.color"
            value={currentBlock?.data?.border?.color}
            label="color"
            type="color"
          />
          <InputField
            onChange={handleChangeData}
            name="border.radius"
            value={currentBlock?.data?.border?.radius}
            type="number"
            label="radius"
            min={0}
            suffix="px"
          />
        </div>
      )}
    </div>
  );
};
export default BaseSettingBorder;
