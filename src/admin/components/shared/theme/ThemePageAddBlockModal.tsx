import SideModal from "../../modal/side-modal";
import Button from "../button";
import CrossIcon from "../icons/cross-icon";
import { BlockType, BlockTypeList } from "./ThemePage";
import { Plus } from "@medusajs/icons";
import * as _ from "lodash";
import {
  DEFAULT_BLOCK_BUTTON_LINK,
  DEFAULT_BLOCK_CATEGORIES,
  DEFAULT_BLOCK_LAYOUT,
  DEFAULT_BLOCK_SLIDER,
} from "./const/defaultBlocks";

interface ThemePageAddBlockModalProps {
  close: () => void;
  isVisible: boolean;
  reload?: () => void;
  currentBlock: BlockType;
  blocks: BlockType[];
  setBlocks: (blocks: BlockType[]) => void;
  setCurrentBlock: (block: BlockType) => void;
}

/**
 * Modal for editing product categories
 */
function ThemePageAddBlockModal(props: ThemePageAddBlockModalProps) {
  const {
    isVisible,
    close,
    reload,
    currentBlock,
    setBlocks,
    blocks,
    setCurrentBlock,
  } = props;
  const onClose = () => {
    close();
  };

  const handleAddBock = (type: BlockTypeList) => {
    let newBlock: BlockType;
    if (type === "layoutChild") {
      newBlock = DEFAULT_BLOCK_LAYOUT;
    }
    if (type === "buttonLink") {
      newBlock = DEFAULT_BLOCK_BUTTON_LINK;
    }

    if (type === "slider") {
      newBlock = DEFAULT_BLOCK_SLIDER;
    }

    if (type === "categories") {
      newBlock = DEFAULT_BLOCK_CATEGORIES;
    }
    setBlocks([...blocks, newBlock]);
    const newBlocks = _.cloneDeep(blocks);
    const path = currentBlock.id.replace(/_/gi, ".children.");
    _.update(newBlocks, path, (value) => {
      newBlock = { ...newBlock, id: value.id + "_" + value.children.length };
      value.children.push(newBlock);
      setCurrentBlock(newBlock);
      return value;
    });
    setBlocks(newBlocks);
    close();
  };

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">
            Add new block
          </h3>
          <Button
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />
        <div className="h-full">
          <div className="flex flex-col gap-2 py-2">
            <div className="w-full flex justify-between items-center py-2 px-3">
              <div className="">Layout</div>
              <Button variant="primary" size="small">
                <Plus
                  onClick={() => {
                    handleAddBock("layoutChild");
                  }}
                />
              </Button>
            </div>

            <div className="w-full flex justify-between items-center py-2 px-3">
              <div className="">Button Link</div>
              <Button variant="primary" size="small">
                <Plus
                  onClick={() => {
                    handleAddBock("buttonLink");
                  }}
                />
              </Button>
            </div>

            <div className="w-full flex justify-between items-center py-2 px-3">
              <div className="">Slider</div>
              <Button variant="primary" size="small">
                <Plus
                  onClick={() => {
                    handleAddBock("slider");
                  }}
                />
              </Button>
            </div>

            <div className="w-full flex justify-between items-center py-2 px-3">
              <div className="">Categories</div>
              <Button variant="primary" size="small">
                <Plus
                  onClick={() => {
                    handleAddBock("categories");
                  }}
                />
              </Button>
            </div>
          </div>
        </div>
        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {/* === FOOTER === */}
        <div className="flex justify-end gap-2 p-3">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={() => {}}>
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  );
}

export default ThemePageAddBlockModal;
