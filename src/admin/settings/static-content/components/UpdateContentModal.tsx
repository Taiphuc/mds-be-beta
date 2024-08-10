import { Button, FocusModal } from "@medusajs/ui";
import QuillEditor from "../../../components/atoms/quill-editor";
import { useState, useEffect } from "react";

type Props = {
  content: { value: string; id: number };
  open: boolean;
  onFinish: (v: { value: string; id: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
};

const UpdateContentModal = ({
  open,
  content: defaultContent,
  onClose,
  onFinish,
  isLoading,
}: Props) => {
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    if (defaultContent) {
      setContent(defaultContent);
    }
  }, [defaultContent]);

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
            isLoading={isLoading}
            onClick={() => onFinish(content)}
            variant="primary"
          >
            Save
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="p-4 overflow-modal">
          <QuillEditor
            value={content.value}
            onChange={(v) => setContent({ id: content.id, value: v })}
          />
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default UpdateContentModal;
