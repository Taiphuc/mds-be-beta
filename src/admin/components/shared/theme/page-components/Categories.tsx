import { Button, Heading } from "@medusajs/ui";
import { FC, ReactNode } from "react";
import { BlockType } from "../ThemePage";
import EditIcon from "../../icons/edit-icon";
import { generateStyle } from "../util/generateStyle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { XMark } from "@medusajs/icons";

type CategoriesProps = {
  children?: ReactNode;
  actionEdit: (e: BlockType) => void;
  actionRemove: (e: BlockType) => void;
  block: BlockType;
};

const Categories: FC<CategoriesProps> = ({ actionEdit, block, children, actionRemove }) => {
  const data = block?.data?.categories;
  return (
    <div className="w-full">
      <div style={generateStyle(block)}>
        <div className="w-full grid grid-cols-2 gap-3">
          <div className="relative rounded-md">
            <img src={data?.category1Image} alt={data?.category1Title} />
            <div className="absolute top-[125px] left-4">
              <p>{data?.category1Title}</p>
              <Heading level="h3">{data?.category1SubTitle}</Heading>

              <div className="py-3">
                <Button>{data?.category1BtnLabel}</Button>
              </div>
            </div>
          </div>

          <div className="relative rounded-md">
            <img src={data?.category2Image} alt={data?.category2Title} />
            <div className="absolute top-[125px] left-4">
              <p>{data?.category2Title}</p>
              <Heading level="h3">{data?.category2SubTitle}</Heading>

              <div className="py-3">
                <Button>{data?.category2BtnLabel}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-4">
        <Button title="Add a block" onClick={() => actionRemove(block)}>
          <XMark />
        </Button>
        <Button title="Add a block" onClick={() => actionEdit(block)}>
          <EditIcon />
        </Button>
      </div>
    </div>
  );
};

export default Categories;
