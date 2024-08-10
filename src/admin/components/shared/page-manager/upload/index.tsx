import { FC, useRef, ChangeEvent, useState } from "react";
import { useAdminCustomPost } from "medusa-react";
import { Button, Input } from "@medusajs/ui";

type UploadProps = {
  onSuccess?: (data?: any, variables?: any, context?: any) => void;
  onError?: (error?: any, variables?: any, context?: any) => void;
  onSettled?: (data?: any, error?: any, variables?: any, context?: any) => void;
};
const Upload: FC<UploadProps> = ({ onError, onSuccess, onSettled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList>(null);

  const { mutate: upload, isLoading: isLoadingUpload } = useAdminCustomPost<any, any>(`/media/upload`, []);
  const handleChangeFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleUpload = () => {
    if (!files) {
      return;
    }
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    upload(formData, {
      onSuccess: (e) => {
        onSuccess(e);
        inputRef.current.value = null;
      },
      onError,
      onSettled,
    });
  };
  return (
    <div className="w-full flex gap-3">
      <Input ref={inputRef} type="file" onChange={handleChangeFiles} multiple />
      <Button disabled={files === null} isLoading={isLoadingUpload} onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};
export default Upload;
