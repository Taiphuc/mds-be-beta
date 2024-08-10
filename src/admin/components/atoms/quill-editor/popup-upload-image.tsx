import { FC, useState, useEffect, ChangeEvent } from "react";
import { useAdminCustomQuery } from "medusa-react";
import { Image } from "antd";
import { FocusModal, Table, Button } from "@medusajs/ui";
import Spinner from "../spinner";
import { Image as ImageType } from "@medusajs/medusa";
import BodyCard from "../../shared/body-card";
import Upload from "../../input/upload";

type PaginationType = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
};

type PopupUploadImageType = {
  onClose?: () => void;
  onUploadImage?: (value: string) => void;
};

const PopupUploadImage: FC<PopupUploadImageType> = ({
  onClose,
  onUploadImage,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string>(null);
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data,
    isLoading: isLoadingPages,
    refetch: refetchData,
  } = useAdminCustomQuery<any, any>("/media", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });
  const handleNextPage = () => {
    const page =
      pagination?.pageIndex + 1 > pagination?.pageCount
        ? pagination?.pageCount
        : pagination?.pageIndex + 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const handlePrePage = () => {
    const page = pagination?.pageIndex > 1 ? pagination?.pageIndex - 1 : 1;
    setPagination({ ...pagination, pageIndex: page });
  };

  const handleChangeCheckBox = (
    e: ChangeEvent<HTMLInputElement>,
    image: ImageType
  ) => {
    if (e.target.checked === false) {
      setSelectedFiles(null);
    } else {
      setSelectedFiles(image.url);
    }
  };

  const uploadProps = {
    onSuccess: (e) => {
      refetchData();
      setSelectedFiles(e.url);
    },
    onError: () => {},
  };

  useEffect(() => {
    if (data?.total) {
      setPagination({
        ...pagination,
        count: data?.total,
        pageIndex: data?.page,
        pageCount: Math.ceil(data?.total / pagination.pageSize),
      });
    }
  }, [data]);

  useEffect(() => {
    refetchData();
  }, [pagination?.pageIndex]);

  return (
    <FocusModal open={true} onOpenChange={onClose}>
      <FocusModal.Trigger></FocusModal.Trigger>
      <FocusModal.Content>
        <BodyCard
          className="h-full"
          title="Media manage"
          subtitle="Manage media of store"
          footerMinHeight={40}
          setBorders
        >
          {isLoadingPages ? (
            <div className="w-full flex items-center justify-center h-56">
              <Spinner />
            </div>
          ) : (
            <div className="w-full py-3 px-2">
              <div className="mb-4">
                <Upload {...uploadProps} />
              </div>
              <div className="w-full">
                <div className="w-full flex items-center">
                  <h2 className="mr-4 font-bold text-xl">Media List</h2>
                  <Button
                    disabled={selectedFiles === null}
                    onClick={() => {
                      onUploadImage(selectedFiles);
                      onClose();
                    }}
                  >
                    USE IMAGE
                  </Button>
                </div>
                <div className="w-full py-4 grid grid-cols-10 gap-1">
                  {data.data?.map((media) => {
                    return (
                      <div id={media?.id}>
                        <div>
                          <input
                            type="checkbox"
                            className="cursor-pointer"
                            onChange={(e) => {
                              handleChangeCheckBox(e, media);
                            }}
                            checked={selectedFiles === media.url}
                          />
                        </div>
                        {media?.metadata?.type !== "video" && (
                          <Image preview={false} src={media?.url} />
                        )}
                        {media?.metadata?.type === "video" && (
                          <video src={media?.url} controls />
                        )}
                      </div>
                    );
                  })}
                </div>
                <Table.Pagination
                  canNextPage
                  canPreviousPage
                  count={pagination.count}
                  pageSize={pagination.pageSize}
                  pageIndex={pagination.pageIndex - 1}
                  pageCount={pagination.pageCount}
                  nextPage={handleNextPage}
                  previousPage={handlePrePage}
                />
              </div>
            </div>
          )}
        </BodyCard>
      </FocusModal.Content>
    </FocusModal>
  );
};
export default PopupUploadImage;
