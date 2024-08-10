import { Image as ImageType } from "@medusajs/medusa";
import { Button, FocusModal } from "@medusajs/ui";
import { useEffect, useState } from "react";
import MediaContent from "./components/MediaContent";

export type Notify = {
  success: (title: string, message: string) => void;
  error: (title: string, message: string) => void;
  warn: (title: string, message: string) => void;
  info: (title: string, message: string) => void;
};

type Props = {
  open: boolean;
  onFinish: (v: ImageType[]) => void;
  onClose: () => void;
  notify: Notify;
  type: "thumbnail" | "media";
  filesSelectedInit?: ImageType[];
  isLoading?: boolean;
};

const MediaModal = ({
  open,
  onClose,
  onFinish,
  isLoading,
  notify,
  type,
  filesSelectedInit,
}: Props) => {
  const [isChange, setIsChange] = useState(false);
  const [filesSelected, setFilesSelected] = useState<ImageType[]>([]);

  useEffect(() => {
    if (filesSelectedInit) {
      setFilesSelected(filesSelectedInit);
    }
  }, [filesSelectedInit]);

  return (
    <FocusModal
      open={open}
      onOpenChange={() => {
        onClose();
      }}
      modal
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <Button
            disabled={!isChange}
            isLoading={isLoading}
            onClick={() => onFinish(filesSelected)}
            variant="primary"
            type="submit"
            form="media-form"
          >
            Save
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="p-4 overflow-modal">
          <MediaContent
            type={type}
            filesSelected={filesSelected}
            setFilesSelected={setFilesSelected}
            setIsChange={setIsChange}
            notify={notify}
          />
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default MediaModal;
