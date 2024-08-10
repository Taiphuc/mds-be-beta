"use-client"

import React, {useEffect, useState, useCallback, useRef} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import EditorToolbar from "./config-quill";
import 'react-quill/dist/quill.snow.css';
import './style.css'
import PopupUploadImage from "./popup-upload-image";

Quill.register('modules/imageResize', ImageResize);

interface HtmlElement {
    value: string | null;
}


type OptionEditBlock = {
    data: string
    onChange?: (value: string) => void;
}


// Undo and redo functions for Custom Toolbar
function undoChange(this: any) {
    this.quill.history.undo();
}

function redoChange(this: any) {
    this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida"
];
Quill.register(Font, true);

// Modules object for setting up the Quill editor
export const modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
            undo: undoChange,
            redo: redoChange
        }
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    },
    imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize']
    }
};

// Formats objects for setting up the Quill editor
export const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
    "video"
];


const FormEditBlock: React.FC<OptionEditBlock> = ({data, onChange}) => {
    const [htmlElement, setHtmlElement] = useState<string>(data);
    const [isOpenUpdateMedia, setIsUpdateMedia] = useState(false);
    const reactQuillRef = useRef<ReactQuill>(null);
    const handleChange = (value: string) => {
        setHtmlElement(value);
        onChange(value);
    };

    useEffect(() => {
        if (data) {
            setHtmlElement(data);
        }
    }, [data]);

    const imageHandler = useCallback(() => {
        setIsUpdateMedia(true);
        setHtmlElement(data || null);
    }, []);

    return (
        <div style={{padding: "12px", width: "60vw", margin: "auto", marginBottom: "100px"}}>
            {isOpenUpdateMedia && (
                <PopupUploadImage
                    onClose={() => {
                        setIsUpdateMedia(false)
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
                    }}/>
            )}
            <div className="text-editor">
                <EditorToolbar/>
                <ReactQuill
                    ref={reactQuillRef}
                    theme="snow"
                    value={htmlElement}
                    onChange={handleChange}
                    placeholder={"Write something awesome..."}
                    modules={{
                        toolbar: {
                            container: "#toolbar",
                            handlers: {
                                undo: undoChange,
                                redo: redoChange,
                                image: imageHandler
                            }
                        },
                        history: {
                            delay: 500,
                            maxStack: 100,
                            userOnly: true
                        },
                        imageResize: {
                            parchment: Quill.import('parchment'),
                            modules: ['Resize', 'DisplaySize']
                        }
                    }}
                    formats={formats}
                />
            </div>
        </div>
    );
};

export default FormEditBlock;
