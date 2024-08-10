import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import { BaseSettingSetType } from "./BaseSettingOfBlock";
import Button from "../../button";
import InputField from "../../../input";
type BaseSettingBackgroundProps = {
  currentBlock: BlockType;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSet: (e: BaseSettingSetType) => void;
};
const BaseSettingBackground: FC<BaseSettingBackgroundProps> = ({ currentBlock, handleChangeData, handleSet }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <h3>Background</h3>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSet("background");
          }}
        >
          {!!currentBlock?.data?.background ? "Unset" : "Set"}
        </Button>
      </div>
      {!!currentBlock?.data?.background && (
        <div className="w-full grid grid-cols-3 gap-2">
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.background?.color}
            name="background.color"
            label="color"
            type="color"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.background?.size}
            name="background.size"
            label="size"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.background?.position}
            name="background.position"
            label="position"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.background?.repeat}
            name="background.repeat"
            label="repeat"
          />
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.background?.image}
            name="background.image"
            label="image"
          />
        </div>
      )}
    </div>
  );
};
export default BaseSettingBackground;
