import SideModal from "../../modal/side-modal";
import Button from "../button";
import CrossIcon from "../icons/cross-icon";
import { BlockType } from "./ThemePage";
import * as _ from "lodash";
import BaseSettingOfBlock from "./page-components/BaseSettingOfBlock";
import SettingOfLayoutBlock from "./page-components/SettingOfLayoutBlock";
import SettingOfSlider from "./page-components/SettingOfSlider";
import SettingOfCategories from "./page-components/SettingOfCategories";

interface ThemePageEditBlockProps {
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
function ThemePageEditBlock(props: ThemePageEditBlockProps) {
  const { isVisible, close, reload, currentBlock, setBlocks, blocks, setCurrentBlock } = props;
  const onClose = () => {
    close();
  };

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900">Edit block</h3>
          <Button variant="secondary" className="h-8 w-8 p-2" onClick={props.close}>
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>

        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />
        <div className="h-full overflow-auto">
          <div className="flex flex-col gap-2 p-2">
            {currentBlock?.type === "layoutChild" && (
              <SettingOfLayoutBlock
                blocks={blocks}
                close={close}
                currentBlock={currentBlock}
                isVisible={isVisible}
                setBlocks={setBlocks}
                setCurrentBlock={setCurrentBlock}
              />
            )}

            {currentBlock?.type === "slider" && (
              <SettingOfSlider
                blocks={blocks}
                close={close}
                currentBlock={currentBlock}
                isVisible={isVisible}
                setBlocks={setBlocks}
                setCurrentBlock={setCurrentBlock}
              />
            )}

            {currentBlock?.type === "categories" && (
              <SettingOfCategories
                blocks={blocks}
                close={close}
                currentBlock={currentBlock}
                isVisible={isVisible}
                setBlocks={setBlocks}
                setCurrentBlock={setCurrentBlock}
              />
            )}
            <div className="block h-[1px] bg-gray-200" />

            <BaseSettingOfBlock
              blocks={blocks}
              close={close}
              currentBlock={currentBlock}
              isVisible={isVisible}
              setBlocks={setBlocks}
              setCurrentBlock={setCurrentBlock}
            />
          </div>
        </div>
      </div>
    </SideModal>
  );
}

export default ThemePageEditBlock;
