import { ChangeEvent, FC, useRef } from "react";
import { useDesign1 } from "./useDesign";
import { useAdminCustomPost } from "medusa-react";

type ImageActionProps = {};

const ImageAction: FC<ImageActionProps> = ({ }) => {
  const { canvas, setLayers, setCurrentLayer, layers, currentLayer } = useDesign1()
  const { mutate: upload, isLoading: isLoadingUpload } = useAdminCustomPost<any, any>(`/media/upload`, []);

  const inputRef = useRef<HTMLInputElement>(null)
  const handleUploadClick = () => {
    inputRef.current?.click();
  }

  const handleChangeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    var _URL = window.URL || window.webkitURL;
    if (file) {
      const imageUrl = _URL.createObjectURL(file);
      const activeObject = canvas?.getActiveObject() as fabric.Image;
      activeObject.setSrc(imageUrl, () => { canvas?.renderAll() })

      const formData = new FormData();
      formData.append('files', file)
      upload(formData, {onSuccess:(res)=>{
        const newLayers = layers?.map((layer)=>{
          if(layer.id === currentLayer.id){
            const newLayer:DESIGN.Layer = {
              ...layer,
              image: res.url
            }
            setCurrentLayer?.(newLayer);
            return newLayer
          }
          return layer
        })
        setLayers?.(newLayers)
      }})
    }
  }
  
  return (<div>
    <button className="border p-2" onClick={handleUploadClick}> Upload Image</button>
    <input ref={inputRef} type="file" name="file" id="image" placeholder="Upload Image" hidden onChange={handleChangeInputFile} accept="image/*" />
  </div>)
}

export default ImageAction 