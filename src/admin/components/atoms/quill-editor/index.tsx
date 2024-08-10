import { useRef, useState, useCallback } from "react";
import ReactQuill, { Quill } from "react-quill";
import EditorToolbar, { formats } from "./config";
import PopupUploadImage from "./popup-upload-image";

type TQuillEditor = {
  value: string;
  onChange: (v: string) => void;
};

function undoChange(this: any) {
  this.quill.history.undo();
}

function redoChange(this: any) {
  this.quill.history.redo();
}

export default function QuillEditor({ value, onChange }: TQuillEditor) {
  const reactQuillRef = useRef<ReactQuill>(null);
  const [isOpenUpdateMedia, setIsUpdateMedia] = useState(false);

  const imageHandler = useCallback(() => {
    setIsUpdateMedia(true);
  }, []);

  return (
    <div className="text-editor">
      <EditorToolbar />
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder="Write something awesome..."
        modules={{
          toolbar: {
            container: "#toolbar",
            handlers: {
              undo: undoChange,
              redo: redoChange,
              image: imageHandler,
            },
          },
          history: {
            delay: 500,
            maxStack: 100,
            userOnly: true,
          },
          imageResize: {
            parchment: Quill.import("parchment"),
            modules: ["Resize", "DisplaySize"],
          },
        }}
        formats={formats}
      />
      {isOpenUpdateMedia && (
        <PopupUploadImage
          onClose={() => {
            setIsUpdateMedia(false);
          }}
          onUploadImage={(url) => {
            const quill = reactQuillRef.current;
            if (quill) {
              const editor = quill.getEditor();
              const range = editor.getSelection();
              if (range) {
                editor.insertEmbed(range.index, "image", url);
                // @ts-ignore
                editor.setSelection(range.index + 1);
              }
            }
          }}
        />
      )}
    </div>
  );
}
