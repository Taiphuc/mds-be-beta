import { ChangeEvent, FC, useRef } from "react";
import { useDesign1 } from "./useDesign";
import { fabric } from "fabric";
import ImageAction from "./ImageAction";
import TextAction from "./TextAction";
import OptionSetting from "./OptionSetting";
import {
  ArrowLongDown,
  ArrowLongLeft,
  ArrowLongRight,
  ArrowLongUp,
  ArrowsPointingOut,
  EllipsisHorizontal,
  EllipsisVertical,
} from "@medusajs/icons";
import { Button } from "@medusajs/ui";
import {
  ExpandOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";

type LayerActionProps = {};

const LayerAction: FC<LayerActionProps> = ({}) => {
  const { canvas, currentLayer, template, setLayers, layers, setCurrentLayer } = useDesign1();

  const handleFitToCanvas = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: template?.top,
      left: template?.left,
      scaleX: (template?.width || 0) / (activeObject.width || 0),
      scaleY: (template?.height || 0) / (activeObject.height || 0),
    });
    canvas?.renderAll();
  };

  const handleAlignTop = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: template?.top,
    });
    canvas?.renderAll();
  };
  const handleAlignBottom = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: (template?.top || 0) + ((template?.height || 0) - (activeObject.getScaledHeight() || 0)),
    });
    canvas?.renderAll();
  };

  const handleItemCenter = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      top: (template?.top || 0) + ((template?.height || 0) - (activeObject.getScaledHeight() || 0)) / 2,
    });
    canvas?.renderAll();
  };
  const handleJustifyCenter = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: (template?.left || 0) + ((template?.width || 0) - (activeObject.getScaledWidth() || 0)) / 2,
    });
    canvas?.renderAll();
  };

  const handleAlignLeft = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: template?.left,
    });
    canvas?.renderAll();
  };

  const handleAlignRight = () => {
    const activeObject = canvas?.getActiveObject() as fabric.Image;
    activeObject.set({
      left: (template?.left || 0) + (template?.width || 0) - (activeObject.getScaledWidth() || 0),
    });
    canvas?.renderAll();
  };

  const handleDeleteLayer = () => {
    const newLayers = layers?.filter((layer) => layer?.id !== currentLayer?.id);
    setCurrentLayer?.();
    setLayers?.(newLayers);
    const currentObject = canvas?.getObjects()?.find((obj) => obj.name === currentLayer?.id);
    if (currentObject) {
      canvas?.remove(currentObject);
    }
  };

  const handleChangeLayer = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newLayers = layers?.map((layer) => {
      if (layer?.id !== currentLayer?.id) {
        const newLayer = { ...layer, isRequired: checked };
        setCurrentLayer?.(newLayer);
        return newLayer;
      }

      return layer;
    });
    setLayers?.(newLayers);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex justify-between bg-[#efefef] px-3 py-2 ">
        <div>Image Selection</div>
        <div className="flex gap-2">
          <Button onClick={handleFitToCanvas} title="Fit to canvas">
            <ExpandOutlined />
          </Button>
          <Button onClick={handleAlignTop} title="Align top">
            <VerticalAlignTopOutlined />
          </Button>
          <Button onClick={handleItemCenter} title="Align items center">
            <VerticalAlignMiddleOutlined />
          </Button>
          <Button onClick={handleAlignBottom} title="Align bottom">
            <VerticalAlignBottomOutlined />
          </Button>
          <Button onClick={handleAlignLeft} title="Align Left">
            <VerticalAlignBottomOutlined className="rotate-90" />
          </Button>
          <Button onClick={handleJustifyCenter} title="Align justify center">
            {" "}
            <VerticalAlignMiddleOutlined className="rotate-90" />
          </Button>
          <Button onClick={handleAlignRight} title="Align Right">
            <VerticalAlignTopOutlined className="rotate-90" />
          </Button>
        </div>
      </div>
      {currentLayer?.type === "image" && <ImageAction />}
      {currentLayer?.type === "text" && <TextAction />}
      <OptionSetting />
      <div className="w-full flex gap-6">
        <div className="flex gap-3">
          <label htmlFor="isRequired">Required:</label>
          <input type="checkbox" name="isRequired" onChange={handleChangeLayer} checked={currentLayer?.isRequired} />
        </div>
        <Button onClick={handleDeleteLayer} variant="danger">
          {" "}
          Delete
        </Button>
      </div>
    </div>
  );
};

export default LayerAction;
