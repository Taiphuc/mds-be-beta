import { FC, ChangeEvent } from "react";
import InputField from "../../../input";
import Button from "../../button";
import { BlockType } from "../ThemePage";
import * as _ from "lodash";
import { DEFAULT_BORDER, DEFAULT_MARGIN, DEFAULT_PADDING, DEFAULT_SHADOW } from "../const/defaultBlocks";

type SettingOfLayoutBlockProps = {
  close: () => void;
  isVisible: boolean;
  reload?: () => void;
  currentBlock: BlockType;
  blocks: BlockType[];
  setBlocks: (blocks: BlockType[]) => void;
  setCurrentBlock: (block: BlockType) => void;
};
const SettingOfLayoutBlock: FC<SettingOfLayoutBlockProps> = ({
  blocks,
  close,
  currentBlock,
  isVisible,
  reload,
  setBlocks,
  setCurrentBlock,
}) => {

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const props = name.split(".");
    let newCurrentBlock: BlockType;
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (block: BlockType) => {
      block.data[props[0]][props[1]] = value;
      newCurrentBlock = block;
      return block;
    });
    setBlocks(newBlocks);
    setCurrentBlock(newCurrentBlock);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex justify-between">
          <h3>Grid</h3>
        </div>
          <div className="w-full grid grid-cols-4 gap-2">
            <InputField
              onChange={handleChangeData}
              value={currentBlock?.data?.grid?.col}
              name="grid.col"
              label="Grid cols"
              min={1}
              max={12}
              type="number"
            />
            {/* <InputField
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
            /> */}
          </div>
      </div>
    </>
  );
};
export default SettingOfLayoutBlock;
