import { FC, ChangeEvent } from "react";
import { BlockType } from "../ThemePage";
import * as _ from "lodash";
import * as DEFAULT_BLOCKS from "../const/defaultBlocks";
import BaseSettingBox from "./BaseSettingBox";
import BaseSettingBackground from "./BaseSettingBackground";
import BaseSettingPadding from "./BaseSettingPadding";
import BaseSettingMargin from "./BaseSettingMargin";
import BaseSettingBorder from "./BaseSettingBorder";
import BaseSettingShadow from "./BaseSettingShadow";

type BaseSettingOfBlockProps = {
  close: () => void;
  isVisible: boolean;
  reload?: () => void;
  currentBlock: BlockType;
  blocks: BlockType[];
  setBlocks: (blocks: BlockType[]) => void;
  setCurrentBlock: (block: BlockType) => void;
};

export type BaseSettingSetType = "padding" | "margin" | "border" | "shadow" | "background" | "box";

const BaseSettingOfBlock: FC<BaseSettingOfBlockProps> = ({
  blocks,
  close,
  currentBlock,
  isVisible,
  reload,
  setBlocks,
  setCurrentBlock,
}) => {

  const handleSet = (type: BaseSettingSetType) => {
    const newCurrentBlock = _.cloneDeep(currentBlock);
    const newBlocks = _.cloneDeep(blocks);
    const defaultData =
      type === "padding"
        ? DEFAULT_BLOCKS.DEFAULT_PADDING
        : type === "margin"
        ? DEFAULT_BLOCKS.DEFAULT_MARGIN
        : type === "border"
        ? DEFAULT_BLOCKS.DEFAULT_BORDER
        : type === "shadow"
        ? DEFAULT_BLOCKS.DEFAULT_SHADOW
        : type === "background"
        ? DEFAULT_BLOCKS.DEFAULT_BACKGROUND
        : type === "box"
        ? DEFAULT_BLOCKS.DEFAULT_BOX
        : {};
    if (!newCurrentBlock?.data?.[type]) {
      newCurrentBlock.data[type] = defaultData;
    } else {
      delete newCurrentBlock?.data?.[type];
    }

    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (value) => {
      value = newCurrentBlock;
      return value;
    });
    setBlocks(newBlocks);
    setCurrentBlock(newCurrentBlock);
  };

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
      <BaseSettingBox currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
      <BaseSettingBackground currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
      <BaseSettingPadding currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
      <BaseSettingMargin currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
      <BaseSettingBorder currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
      <BaseSettingShadow currentBlock={currentBlock} handleChangeData={handleChangeData} handleSet={handleSet} />
    </>
  );
};
export default BaseSettingOfBlock;
