import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
import { InformationCircle } from "@medusajs/icons";
type BaseSettingBoxProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingBox: FC<BaseSettingBoxProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>Box</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("box");
          }}
        >
          {!!currentBlock?.data?.box ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.box && (
        <div className="w-full grid grid-cols-3 gap-2">
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.box?.width}
            name="box.width"
            label="width"
            type="width"
          />

          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.box?.height}
            name="box.height"
            label="height"
          />

          <div title="example 100% or 300px for value" className=" flex items-baseline cursor-pointer">
            <InformationCircle />
          </div>
        </div>
      )}
    </div>
  );
};
export default BaseSettingBox;
