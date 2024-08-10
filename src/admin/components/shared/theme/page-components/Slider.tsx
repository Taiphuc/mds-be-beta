import { Button, Heading } from "@medusajs/ui";
import { FC, ReactNode } from "react";
import { BlockType } from "../ThemePage";
import EditIcon from "../../icons/edit-icon";
import { generateStyle } from "../util/generateStyle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { XMark } from "@medusajs/icons";

type SliderProps = {
  children?: ReactNode;
  actionEdit: (e: BlockType) => void;
  actionRemove: (e: BlockType) => void;
  block: BlockType;
};

const Slider: FC<SliderProps> = ({ actionEdit, block, children, actionRemove }) => {
  const settings = block?.data?.slider?.settings;
  return (
    <div className="w-full">
      <div style={generateStyle(block)}>
        <Swiper
          slidesPerView={settings?.slidesPerView}
          pagination={settings?.pagination}
          autoplay={settings?.autoplay}
          modules={[Autoplay, Pagination]}
          className="h-full"
        >
          {block?.data?.slider?.items?.map((item, i) => {
            if (i == 0) {
              return (
                <SwiperSlide
                  key={i}
                  className="w-full h-full flex items-center"
                  style={{
                    backgroundImage: `url(${item?.image})`,
                    height: block?.data?.box?.height,
                    position: "relative",
                    backgroundColor: "#f1f1f1",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: " center center",
                  }}
                >
                  <div className="flex flex-col gap-3 p-3">
                    <span>{item?.description}</span>
                    <Heading level="h1">{item?.title}</Heading>
                    <p>{item?.subDescription}</p>

                    <div className="flex gap-3">
                      <Button>{item.btn1Title}</Button>
                      <Button>{item.btn2Title}</Button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            }
            return <></>;
          })}
        </Swiper>
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

export default Slider;
