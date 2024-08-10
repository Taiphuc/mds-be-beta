import { FC, ChangeEvent } from "react";
import InputField from "../../../input";
import { BlockType } from "../ThemePage";
import * as _ from "lodash";
import { DEFAULT_BLOCK_SLIDER_ITEM } from "../const/defaultBlocks";
import { Button, Label, ProgressAccordion, Switch } from "@medusajs/ui";
import SearchLink from "../../../input/search-link";

type SettingOfSliderProps = {
  close: () => void;
  isVisible: boolean;
  reload?: () => void;
  currentBlock: BlockType;
  blocks: BlockType[];
  setBlocks: (blocks: BlockType[]) => void;
  setCurrentBlock: (block: BlockType) => void;
};
const SettingOfSlider: FC<SettingOfSliderProps> = ({
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

  const handleChangeSwitch = (e: { name: string; value: boolean }) => {
    const { name, value } = e;
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

  const handleAddItem = () => {
    let newCurrentBlock: BlockType;
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (block: BlockType) => {
      block.data.slider.items.push(DEFAULT_BLOCK_SLIDER_ITEM);
      newCurrentBlock = block;
      return block;
    });
    setBlocks(newBlocks);
    setCurrentBlock(newCurrentBlock);
  };

  const handleChangeItem = (
    id: number,
    item: any,
    e: ChangeEvent<HTMLInputElement> | { target: { value: string; name: string } }
  ) => {
    const { name, value } = e.target;
    const newItem = { ...item, [name]: value };
    let newCurrentBlock: BlockType;
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (block: BlockType) => {
      block.data.slider.items[id] = newItem;
      newCurrentBlock = block;
      return block;
    });
    setBlocks(newBlocks);
    setCurrentBlock(newCurrentBlock);
  };

  const handleRemoveItem = (id: number) => {
    let newCurrentBlock: BlockType;
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (block: BlockType) => {
      block.data.slider.items = block.data.slider.items?.filter((_, i) => i !== id);
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
          <h3>Settings per view</h3>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.slider?.settings?.slidesPerView}
            name="slider.settings.slidesPerView"
            label="slides per view"
            min={1}
            max={12}
            type="number"
          />

          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.slider?.settings?.spaceBetween || 0}
            name="slider.settings.?.spaceBetween"
            label="space between of image"
            min={0}
            type="number"
          />
        </div>
      </div>

      <div className="w-full">
        <div className="w-full flex justify-between">
          <h3>Settings Autoplay</h3>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          <InputField
            onChange={handleChangeData}
            value={currentBlock?.data?.slider?.settings?.autoplay?.delay}
            name="slider.settings.autoplay.delay"
            label="delay time ms"
            min={0}
            type="number"
          />

          <div className="flex flex-col content-between gap-x-2">
            <Label htmlFor="disableOnInteraction">disable in interaction</Label>
            <Switch
              id="disableOnInteraction"
              onCheckedChange={(e) => {
                handleChangeSwitch({ name: "slider.settings.autoplay.disableOnInteraction", value: e });
              }}
              name="slider.settings.autoplay.disableOnInteraction"
              checked={currentBlock?.data?.slider?.settings?.autoplay?.disableOnInteraction}
            />
          </div>

          <div className="flex flex-col content-between gap-x-2">
            <Label htmlFor="pauseOnMouseEnter">pause on mouse enter</Label>
            <Switch
              id="pauseOnMouseEnter"
              onCheckedChange={(e) => {
                handleChangeSwitch({ name: "slider.settings.autoplay.pauseOnMouseEnter", value: e });
              }}
              name="slider.settings.autoplay.pauseOnMouseEnter"
              checked={currentBlock?.data?.slider?.settings?.autoplay?.pauseOnMouseEnter}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full flex justify-between">
          <h3>Settings Pagination</h3>
        </div>
        <div className="w-full grid grid-cols-3 gap-2">
          <div className="flex flex-col content-between gap-x-2">
            <Label htmlFor="clickable">pause on mouse enter</Label>
            <Switch
              id="clickable"
              onCheckedChange={(e) => {
                handleChangeSwitch({ name: "slider.settings.pagination.clickable", value: e });
              }}
              name="slider.settings.pagination?.clickable"
              checked={currentBlock?.data?.slider?.settings?.pagination?.clickable}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="w-full flex justify-between">
          <h3>Items</h3>
          <Button variant="secondary" onClick={handleAddItem}>
            Add item
          </Button>
        </div>
        <div className="w-full mt-2">
          <ProgressAccordion type="single">
            {currentBlock?.data?.slider?.items?.map((item, i) => {
              return (
                <ProgressAccordion.Item value={`${i}`} key={i}>
                  <ProgressAccordion.Header>Item {i + 1}</ProgressAccordion.Header>
                  <ProgressAccordion.Content>
                    <div className="w-full grid grid-cols-1 gap-2 p-2 overflow-auto">
                      <Button
                        onClick={() => {
                          handleRemoveItem(i);
                        }}
                      >
                        Remove item
                      </Button>
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.btn2Title}
                        name="btn1Title"
                        label="button 1 title"
                      />
                      <SearchLink
                        data={item}
                        onClick={(value: string, item: any) => {
                          handleChangeItem(i, item, { target: { name: "btn1Link", value } });
                        }}
                        defaultValue={item?.btn1Link}
                      />
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.title}
                        name="title"
                        label="title"
                      />
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.image}
                        name="image"
                        label="image"
                      />
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.description}
                        name="description"
                        label="description"
                      />
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.subDescription}
                        name="subDescription"
                        label="sub description"
                      />
                      <InputField
                        onChange={(e) => {
                          handleChangeItem(i, item, e);
                        }}
                        value={item?.btn2Title}
                        name="btn2Title"
                        label="button 2 title"
                      />
                      <SearchLink
                        data={item}
                        onClick={(value: string, item: any) => {
                          handleChangeItem(i, item, { target: { name: "btn2Link", value } });
                        }}
                        defaultValue={item?.btn2Link}
                      />
                    </div>
                  </ProgressAccordion.Content>
                </ProgressAccordion.Item>
              );
            })}
          </ProgressAccordion>
        </div>
      </div>
    </>
  );
};
export default SettingOfSlider;
