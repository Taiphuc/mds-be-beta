import { Image as ImageType } from "@medusajs/medusa";
import { Button, Tabs } from "@medusajs/ui";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useState } from "react";
import MediaLibrary from "./media-library";
import UploadFiles from "./upload-files";

export type TPagination = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
};
export type Notify = {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  warn: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
};

type TMediaContent = {
  notify: Notify;
  setIsChange: (v: boolean) => void;
  filesSelected: ImageType[];
  setFilesSelected: (v: ImageType[]) => void;
  type: "thumbnail" | "media";
  mediaCol?: number;
};
export default function MediaContent({
  notify,
  setIsChange,
  filesSelected,
  setFilesSelected,
  type,
  mediaCol = 10,
}: TMediaContent) {
  const [tab, setTab] = useState<"upload_files" | "media_library">(
    "upload_files"
  );
  const [pagination, setPagination] = useState<TPagination>({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data: listMedia,
    isLoading: isLoadingMedia,
    isFetching: isFetchingMedia,
    refetch: refetchMedia,
  } = useAdminCustomQuery<any, any>(
    "/media",
    ["list-media", JSON.stringify(pagination)],
    {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    },
    {
      keepPreviousData: true,
    }
  );

  const { mutate: deleteFiles, isLoading: isLoadingDelete } =
    useAdminCustomPost<any, any>(`/media/delete`, []);
  const handleDeleteFiles = () => {
    deleteFiles(
      {
        ids: filesSelected?.map((file) => file.id),
      },
      {
        onSuccess: () => {
          notify.success("Deleted Successfully", "Deleted files successfully");
          refetchMedia();
          setFilesSelected([]);
        },
        onError: () => {
          notify.error("Deleted error", "deleted failed");
        },
      }
    );
  };
  const handleSelectAll = () => {
    if (listMedia?.data?.length > 0)
      setFilesSelected(
        filesSelected.length === listMedia.data.length ? [] : listMedia.data
      );
  };
  return (
    <Tabs value={tab} defaultValue="upload_files">
      <Tabs.List>
        <Tabs.Trigger
          onClick={() => setTab("upload_files")}
          value="upload_files"
        >
          Upload Files
        </Tabs.Trigger>
        <Tabs.Trigger
          onClick={() => setTab("media_library")}
          value="media_library"
        >
          Media Library
        </Tabs.Trigger>
      </Tabs.List>
      <div className="flex flex-col gap-y-4">
        <Tabs.Content value="upload_files">
          <UploadFiles
            setTab={setTab}
            notify={notify}
            refetchMedia={refetchMedia}
          />
        </Tabs.Content>
        <Tabs.Content value="media_library">
          {type === "media" && (
            <div className="mt-6 mb-4 flex items-center justify-between">
              <div>
                <Button variant="secondary" onClick={handleSelectAll}>
                  Select all
                </Button>
              </div>
              {filesSelected.length > 0 && (
                <Button
                  isLoading={isLoadingDelete}
                  variant="danger"
                  onClick={handleDeleteFiles}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
          <MediaLibrary
            mediaCol={mediaCol}
            setIsChange={setIsChange}
            filesSelected={filesSelected}
            setFilesSelected={setFilesSelected}
            isMultiple={type === "media"}
            setPagination={setPagination}
            pagination={pagination}
            listMedia={listMedia}
            isLoading={isLoadingMedia || isFetchingMedia}
          />
        </Tabs.Content>
      </div>
    </Tabs>
  );
}
