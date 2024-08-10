import { FC, ChangeEvent } from "react";
import InputField from "../../../input";
import { BlockType } from "../ThemePage";
import * as _ from "lodash";
import { DEFAULT_BLOCK_SLIDER_ITEM } from "../const/defaultBlocks";
import { Button, Label, ProgressAccordion, Switch } from "@medusajs/ui";
import SearchLink from "../../../input/search-link";
import Spacer from "../../spacer";

type SettingOfCategoriesProps = {
  close: () => void;
  isVisible: boolean;
  reload?: () => void;
  currentBlock: BlockType;
  blocks: BlockType[];
  setBlocks: (blocks: BlockType[]) => void;
  setCurrentBlock: (block: BlockType) => void;
};
const SettingOfCategories: FC<SettingOfCategoriesProps> = ({
  blocks,
  close,
  currentBlock,
  isVisible,
  reload,
  setBlocks,
  setCurrentBlock,
}) => {
  const handleChangeData = (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const props = name.split(".");
    let newCurrentBlock: BlockType;
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (block: BlockType) => {
      if (props?.length === 2) {
        block.data[props[0]][props[1]] = value;
      }
      if (props?.length === 3) {
        block.data[props[0]][props[1]][props[2]] = value;
      }
      if (props?.length === 4) {
        block.data[props[0]][props[1]][props[2]][props[3]] = value;
      }
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
          <h3>Categories settings</h3>
        </div>
        <div className="w-full grid grid-cols-1 gap-2 p-2 ">
          <ProgressAccordion type="single">
            <ProgressAccordion.Item value="1">
              <ProgressAccordion.Header>Category 1</ProgressAccordion.Header>
              <ProgressAccordion.Content>
                <div className="w-full overflow-auto">
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category1BtnLabel}
                    name="categories.category1BtnLabel"
                    label="category 1 button label"
                  />
                  <SearchLink
                    data={currentBlock}
                    onClick={(value: string, item: any) => {
                      handleChangeData({ target: { value, name: "categories.category1BtnLink" } });
                    }}
                    defaultValue={currentBlock?.data?.categories?.category1BtnLink}
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category1Image}
                    name="categories.category1Image"
                    label="category 1 image"
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category1Title}
                    name="categories.?.category1Title"
                    label="category 1 Title"
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category1SubTitle}
                    name="categories.?.category1SubTitle"
                    label="category 1 sub title"
                  />
                  <Spacer />
                </div>
              </ProgressAccordion.Content>
            </ProgressAccordion.Item>

            <ProgressAccordion.Item value="2">
              <ProgressAccordion.Header>Category 2</ProgressAccordion.Header>
              <ProgressAccordion.Content>
                <div className="w-full overflow-auto">
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category2BtnLabel}
                    name="categories.category2BtnLabel"
                    label="category 2 button label"
                  />
                  <SearchLink
                    data={currentBlock}
                    onClick={(value: string, item: any) => {
                      handleChangeData({ target: { value, name: "categories.category2BtnLink" } });
                    }}
                    defaultValue={currentBlock?.data?.categories?.category2BtnLink}
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category2Image}
                    name="categories.category2Image"
                    label="category 2 image"
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category2Title}
                    name="categories.?.category2Title"
                    label="category 2 Title"
                  />
                  <InputField
                    onChange={handleChangeData}
                    value={currentBlock?.data?.categories?.category2SubTitle}
                    name="categories.?.category2SubTitle"
                    label="category 2 sub title"
                  />
                  <Spacer />
                </div>
              </ProgressAccordion.Content>
            </ProgressAccordion.Item>
          </ProgressAccordion>
        </div>
      </div>
    </>
  );
};
export default SettingOfCategories;
