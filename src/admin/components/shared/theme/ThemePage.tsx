import { FC, useState } from "react";
import { Select, useToggleState } from "@medusajs/ui";
import ThemePageAddBlockModal from "./ThemePageAddBlockModal";
import RenderPage from "./page-components/RenderPage";
import ThemePageEditBlock from "./ThemePageEditBlock";
import * as _ from "lodash";

export type BlockTypeList =
  | "layoutRoot"
  | "layoutChild"
  | "buttonLink"
  | "slider"
  | "categories";

export type BlockType = {
  id: string;
  name: string;
  type: BlockTypeList;
  data: BlockDataType;
  children: BlockType[];
};

export type BlockDataType = {
  categories?: {
    category1Title?: string;
    category1SubTitle?: string;
    category1Image?: string;
    category1BtnLabel?: string;
    category1BtnLink?: string;
    category2Title?: string;
    category2SubTitle?: string;
    category2BtnLink?: string;
    category2BtnLabel?: string;
    category2Image?: string;
  };
  slider?: {
    settings?: {
      spaceBetween?: number;
      slidesPerView?: number;
      pagination?: {
        clickable?: boolean;
      };
      autoplay?: {
        delay?: number;
        disableOnInteraction?: boolean;
        pauseOnMouseEnter?: boolean;
      };
      breakpoints?: {
        [key: number]: { slidesPerView: number };
      };
      modules?: string[];
    };
    items?: {
      image?: string;
      title?: string;
      description?: string;
      subDescription?: string;
      link?: string;
      btn1Title?: string;
      btn2Title?: string;
      btn1Link?: string;
      btn2Link?: string;
    }[];
  };
  buttonLink?: {
    text?: string;
    link?: string;
    title?: string;
  };
  text?: {
    color?: string;
    transform?:
      | "capitalize"
      | "full-size-kana"
      | "full-width"
      | "lowercase"
      | "none"
      | "uppercase";
  };
  box?: {
    width?: string;
    height?: string;
  };
  background?: {
    color?: string;
    image?: string;
    repeat?: string;
    position?: string;
    size?: string;
  };
  grid?: {
    col?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  border?: {
    width?: number;
    color?: string;
    radius?: number;
  };
  shadow?: {
    vertical?: number;
    horizontal?: number;
    opacity?: number;
    blur?: number;
  };
};
type ThemePageProps = {
  theme?: any;
  updateTheme?: any;
  setUpdateTheme: (e?: any) => void;
};
const ThemePage: FC<ThemePageProps> = ({
  theme,
  setUpdateTheme,
  updateTheme,
}) => {
  const [currentPage, setCurrentPage] = useState<any>(theme?.pages?.[0]);
  const [blocks, setBlocks] = useState<BlockType[]>([
    {
      id: "0",
      name: "root",
      type: "layoutRoot",
      data: {},
      children: [],
    },
  ]);
  const [currentBlock, setCurrentBlock] = useState<BlockType>();
  const {
    state: isVisibleAddBlock,
    close: closeAddBlock,
    open: openAddBlock,
  } = useToggleState();
  const {
    state: isVisibleEditBlock,
    close: closeEditBlock,
    open: openEditBlock,
  } = useToggleState();
  const handleOpenAddBlock = (block: BlockType) => {
    setCurrentBlock(block);
    openAddBlock();
  };
  const handleOpenEditBlock = (block: BlockType) => {
    setCurrentBlock(block);
    openEditBlock();
  };

  const handleCloseAddBlock = () => {
    closeAddBlock();
    openEditBlock();
  };

  const handleCloseEditBlock = () => {
    setCurrentBlock(undefined);
    closeEditBlock();
  };

  const handleRemove = (e: BlockType) => {
    const newBlocks = _.cloneDeep(blocks);
    const parentId = e.id.split("_");
    parentId.pop();
    const parentPath = parentId.join(".children.");
    _.update(newBlocks, parentPath, (value: BlockType) => {
      value.children = value?.children?.filter((v) => v.id !== e.id);
      const length = value.children.length;
      const childrenId = e.id.split("_").reverse();
      for (let i = +childrenId[0]; i < length; i++) {
        const temp = value.children[i].id.split("_");
        temp[temp.length - 1] = i.toString();
        value.children[i].id = temp.join("_");
      }
      setCurrentBlock(value);
      return value;
    });
    setBlocks(newBlocks);
    close();
  };

  return (
    <div className="w-full mt-4 min-h-screen gap-2 flex flex-col">
      <div className="w-full m-2">
        <div className="w-[250px]">
          <Select
            value={currentPage?.id}
            // onValueChange={(value) => handleChangeBody({ target: { name: "font", value } })}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {theme?.pages?.map((item) => (
                <Select.Item key={item.id} value={item.id}>
                  {item.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center h-full overflow-y-auto">
        <RenderPage
          actionRemove={handleRemove}
          blocks={blocks}
          actionAdd={handleOpenAddBlock}
          actionEdit={handleOpenEditBlock}
        />
      </div>

      <ThemePageAddBlockModal
        setCurrentBlock={setCurrentBlock}
        close={handleCloseAddBlock}
        isVisible={isVisibleAddBlock}
        currentBlock={currentBlock}
        blocks={blocks}
        setBlocks={setBlocks}
      />

      <ThemePageEditBlock
        setCurrentBlock={setCurrentBlock}
        close={handleCloseEditBlock}
        isVisible={isVisibleEditBlock}
        currentBlock={currentBlock}
        blocks={blocks}
        setBlocks={setBlocks}
      />
    </div>
  );
};
export default ThemePage;
