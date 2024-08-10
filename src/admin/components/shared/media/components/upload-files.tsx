import { Button, Label } from "@medusajs/ui";
import { Col, Image, Input, InputNumber, Row, Space } from "antd";
import { useAdminCustomPost } from "medusa-react";
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import FileUploadField from "../../../input/file-upload-field";
import { canvasPreview, canvasToFile } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import { Notify } from "./MediaContent";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

type TImg = { id: string; src: string; file: File };
type TUploadFiles = {
  refetchMedia: () => void;
  notify: Notify;
  setTab: (v: "upload_files" | "media_library") => void;
};

export default function UploadFiles({ refetchMedia, setTab }: TUploadFiles) {
  const { mutate: upload, isLoading: isLoadingUpload } = useAdminCustomPost<
    any,
    any
  >(`/media/upload`, ["upload"]);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [cropImg, setCropImg] = useState<TImg>();
  const [images, setImages] = useState<TImg[]>([]);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const handleSubmit = () => {
    const formData = new FormData();
    for (const file of images) {
      formData.append("files", file.file);
    }
    upload(formData, {
      onSuccess: () => {
        refetchMedia();
        setTab("media_library");
      },
      onError: () => {},
    });
  };

  const handleUpload = (files: File[]) => {
    if (!files || files.length === 0) {
      return;
    }

    const imagePromises = Array.from(files).map((file, index) => {
      return new Promise<TImg>((resolve, reject) => {
        // Kiểm tra nếu tệp là ảnh (type bắt đầu bằng "image/")
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              resolve({
                id: `${file.name}_${index}`,
                src: reader.result.toString(),
                file,
              });
            } else {
              reject(new Error("File reading failed"));
            }
          };
          reader.onerror = () => reject(new Error("File reading failed"));
          reader.readAsDataURL(file);
        } else {
          resolve(null); // Nếu không phải ảnh, trả về null
        }
      });
    });

    Promise.all(imagePromises)
      .then((results) => {
        const validImages = results.filter((item) => item !== null);
        setImages([...images, ...validImages]);
      })
      .catch((error) => {
        console.error("Error processing images:", error);
      });
  };

  // Crop
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        // Updates the preview
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  const handleSaveCrop = async () => {
    if (!imgRef.current || !previewCanvasRef.current || !completedCrop) {
      return; // Check if necessary elements are available
    }

    canvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      completedCrop,
      scale,
      rotate
    );

    const newFile = await canvasToFile(
      previewCanvasRef.current,
      cropImg.file.name
    );

    const newUrl = URL.createObjectURL(newFile); // Use newFile directly

    // Find the index of the image in the images array
    const index = images.findIndex((img) => img.id === cropImg.id);

    // Create a new array with the updated image
    const newImages = [...images];
    newImages.splice(index, 1, { ...cropImg, file: newFile, src: newUrl });

    setImages(newImages);
    setCropImg(undefined);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    setAspect(16 / 9);
  };

  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <div className="flex flex-col gap-y-2">
        <FileUploadField
          disabled={isLoadingUpload}
          onFileChosen={(files) => handleUpload(files)}
          placeholder="1200 x 1600 (3:4) recommended, up to 10MB each"
          multiple
          filetypes={["image/gif", "image/jpeg", "image/png", "image/webp"]}
          className="py-large"
        />
      </div>
      {images.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <Label>Click on the photo to crop</Label>
            <Button
              isLoading={isLoadingUpload}
              variant="primary"
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setCompletedCrop(undefined);
                  setCropImg(img);
                }}
                className="flex h-full w-full items-center justify-center cursor-pointer"
              >
                <Image
                  preview={false}
                  src={img.src}
                  alt="Uploaded Image"
                  className="rounded-rounded max-w-full max-h-[150px] object-contain"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!!cropImg && (
        <div>
          <Row gutter={[12, 12]}>
            <Col span={4}>
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4">
                  <Label className="min-w-[60px]" htmlFor="scale-input">
                    Scale:{" "}
                  </Label>
                  <InputNumber
                    min={0}
                    id="scale-input"
                    type="number"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e))}
                  />
                </div>
                <div className="flex items-center gap-x-4">
                  <Label className="min-w-[60px]" htmlFor="rotate-input">
                    Rotate:{" "}
                  </Label>
                  <InputNumber
                    id="rotate-input"
                    type="number"
                    value={rotate}
                    onChange={(e) =>
                      setRotate(Math.min(180, Math.max(-180, Number(e))))
                    }
                  />
                </div>
                <div>
                  <Button variant="primary" onClick={handleToggleAspectClick}>
                    Toggle aspect {aspect ? "off" : "on"}
                  </Button>
                </div>
                <div className="mt-4">
                  <Button
                    className="mr-2"
                    variant="danger"
                    onClick={() => setCropImg(undefined)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveCrop}>
                    Save
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={20}>
              <Row gutter={[0, 12]}>
                <Col span={24}>
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => {
                      setCompletedCrop(c);
                    }}
                    aspect={aspect}
                    minHeight={20}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={cropImg.src}
                      style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                </Col>
                <Col span={24}>
                  {!!completedCrop && (
                    <>
                      <div>
                        <canvas
                          ref={previewCanvasRef}
                          style={{
                            border: "1px solid black",
                            objectFit: "contain",
                            width: completedCrop.width,
                            height: completedCrop.height,
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <Space size={2} direction="vertical">
                          <span>Width: {completedCrop.width}</span>
                          <span>Height: {completedCrop.height}</span>
                        </Space>
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
