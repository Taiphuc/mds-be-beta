import { CheckCircleSolid } from "@medusajs/icons";
import { Image as ImageType } from "@medusajs/medusa";
import { Label, Table } from "@medusajs/ui";
import { Image, Pagination, PaginationProps, Spin } from "antd";
import clsx from "clsx";
import { TPagination } from "./MediaContent";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";

type TImage = {
  image: ImageType;
  isSelected: boolean;
  onSelected: (image: ImageType) => void;
};

const ImageItem = ({ image, isSelected, onSelected }: TImage) => {
  return (
    <div className="relative">
      <button
        className={clsx(
          "hover:bg-grey-5 rounded-rounded group flex items-center justify-center w-full h-full",
          {
            "bg-grey-5": isSelected,
          }
        )}
        type="button"
        onClick={() => {
          onSelected(image);
        }}
      >
        <div className="gap-x-large flex items-center">
          <div className="flex h-full w-full items-center justify-center">
            <Image
              preview={false}
              src={image.url}
              alt="Uploaded image"
              className="rounded-rounded max-w-full max-h-[150px] object-contain"
            />
          </div>

          <span
            className={clsx("hidden", {
              "!text-violet-60 bottom-xsmall right-xsmall absolute !block":
                isSelected,
            })}
          >
            <CheckCircleSolid />
          </span>
        </div>
      </button>
    </div>
  );
};

type TMediaLibrary = {
  filesSelected: ImageType[];
  setFilesSelected: React.Dispatch<React.SetStateAction<ImageType[]>>;
  isMultiple: boolean;
  isLoading: boolean;
  listMedia: {
    data: ImageType[];
    page: number;
    total: number;
    count: number;
    pageCount: number;
  };
  pagination: TPagination;
  setPagination: React.Dispatch<React.SetStateAction<TPagination>>;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  mediaCol: number;
};
export default function MediaLibrary({
  filesSelected,
  setFilesSelected,
  isMultiple,
  setPagination,
  pagination,
  listMedia,
  isLoading,
  mediaCol,
  setIsChange,
}: TMediaLibrary) {
  const onChangePage = (page: number, pageSize: number) => {
    setPagination({ ...pagination, pageIndex: page, pageSize });
  };

  const handleSelectFile = (fileS: ImageType) => {
    setIsChange(true);
    setFilesSelected((old) => {
      if (isMultiple) {
        const index = old.findIndex((item) => item.id === fileS.id);
        if (index < 0) {
          return [...old, fileS];
        }
        return [...old.slice(0, index), ...old.slice(index + 1)];
      }
      return [fileS];
    });
  };
  return (
    <div className="flex flex-col gap-y-2 mt-4">
      {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Spin />
        </div>
      ) : (
        <>
          {listMedia?.data?.length > 0 && (
            <div className="mt-large">
              <div className={`grid grid-cols-${mediaCol} gap-4`}>
                {listMedia.data.map((file: ImageType, index: number) => {
                  const isSelected = filesSelected.some((f) =>
                    isMultiple ? f.id === file.id : f.url === file.url
                  );
                  return file?.metadata?.type === "video" ? (
                    <video src={file?.url} controls />
                  ) : (
                    <ImageItem
                      isSelected={isSelected}
                      key={index}
                      image={file}
                      onSelected={() => handleSelectFile(file)}
                    />
                  );
                })}
              </div>
            </div>
          )}
          <Pagination
            className="mt-4 flex justify-end"
            responsive
            showSizeChanger
            hideOnSinglePage
            onChange={onChangePage}
            defaultCurrent={1}
            defaultPageSize={20}
            pageSize={pagination.pageSize}
            current={pagination.pageIndex}
            total={listMedia?.total}
          />
        </>
      )}
    </div>
  );
}
