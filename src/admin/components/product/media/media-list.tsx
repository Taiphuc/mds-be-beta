import { FC, useState, ChangeEvent, useEffect } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Image as ImageType } from "@medusajs/medusa";
import {
  Button,
  Dropdown,
  Image,
  Input,
  MenuProps,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Table } from "@medusajs/ui";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useExtensionBaseProps } from "../../hooks/use-extension-base-props";

type PaginationType = {
  count: number;
  pageSize: number;
  pageIndex: number;
  pageCount: number;
};

const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type MediaListProps = {
  actions?: MenuProps["items"];
  isSelectOne?: boolean;
  setData?: (data: ImageType[]) => void;
  productMedia?: ImageType[];
};
const MediaList: FC<MediaListProps> = ({
  actions,
  isSelectOne,
  setData,
  productMedia,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<ImageType[]>(
    productMedia || []
  );
  const { notify } = useExtensionBaseProps();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    count: 0,
    pageSize: 20,
    pageIndex: 1,
    pageCount: 1,
  });
  const {
    data,
    isLoading: isLoadingData,
    refetch: refetchData,
  } = useAdminCustomQuery<any, any>("/media", [], {
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const { mutate: upload, isLoading: isLoadingUpload } = useAdminCustomPost<
    any,
    any
  >(`/media/upload`, []);

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
    let result = [...selectedFiles];
    if (e.target.checked) {
      result.push(image);
    } else {
      result = result.filter((res) => res.id !== image.id);
    }
    setSelectedFiles(result);
  };

  const handleChangePageSize = (e: ChangeEvent<HTMLInputElement>) => {
    setPagination({ ...pagination, pageSize: +e.target.value });
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {isLoadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleBeforeUpload = (file) => {
    // Add any validation logic here
    return true; // Return false to prevent upload
  };

  const handleCustomRequest = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append("files", file);
    upload(formData, {
      onSuccess: () => {
        onSuccess();
        notify.success(
          "File upload successfully",
          `${file.name} uploaded successfully`
        );
        refetchData();
      },
      onError: (error) => {
        onError(error);
        notify.error("File upload failed", `${file.name} upload failed.`);
      },
    });
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
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
  }, [pagination?.pageIndex, pagination.pageSize]);

  useEffect(() => {
    setData(selectedFiles);
  }, [selectedFiles]);
  return (
    <>
      <div className="w-full py-2 flex justify-between gap-2">
        <div className="w-full flex flex-wrap">
          <Upload
            multiple
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={handleBeforeUpload}
            customRequest={handleCustomRequest}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </div>
        <div className="flex flex-wrap gap-2">
          <span>Number items / page </span>{" "}
          <Input
            value={pagination.pageSize}
            min={1}
            max={500}
            type="number"
            step={1}
            onChange={handleChangePageSize}
          />
        </div>
        {actions?.length > 0 && (
          <Dropdown menu={{ items: actions }} placement="bottomCenter" arrow>
            <Button>Actions</Button>
          </Dropdown>
        )}
      </div>
      <div className="w-full py-4 grid grid-cols-10 gap-1">
        {data?.data?.map((media) => {
          return (
            <div id={media?.id}>
              <div>
                <input
                  type={isSelectOne ? "radio" : "checkbox"}
                  name="image"
                  className="cursor-pointer"
                  onChange={(e) => {
                    handleChangeCheckBox(e, media);
                  }}
                  checked={
                    isSelectOne
                      ? selectedFiles.some((s) => s.id === media.id)
                      : productMedia?.some((s) => s.id === media.id)
                  }
                />
              </div>
              {media?.metadata?.type !== "video" && <Image src={media?.url} />}
              {media?.metadata?.type === "video" && (
                <video src={media?.url} controls />
              )}
            </div>
          );
        })}
      </div>
      <Table.Pagination
        canPreviousPage
        canNextPage
        count={pagination.count}
        pageSize={pagination.pageSize}
        pageIndex={pagination.pageIndex - 1}
        pageCount={pagination.pageCount}
        nextPage={handleNextPage}
        previousPage={handlePrePage}
      />
    </>
  );
};
export default MediaList;
