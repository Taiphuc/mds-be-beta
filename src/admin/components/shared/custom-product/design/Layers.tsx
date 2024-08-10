import { FC, useState } from "react";
import { useDesign1 } from "./useDesign";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDropLayer from "./DragDropLayer";
import { Button } from "@medusajs/ui";
import { FileAddOutlined, PlusOutlined, RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { AutoComplete, Select } from "antd";
import { useAdminProducts } from "medusa-react"
import { Product } from "@medusajs/medusa";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";

type LayersProps = {};

const Layers: FC<LayersProps> = ({ }) => {
  const { histories, addImageLayer, addTextLayer } = useDesign1()
  const handleUndo = () => {
    histories?.undo?.()
  }

  const handleRedo = () => {
    histories?.redo?.()
  }

  const handleAddLayerImage = () => {
    addImageLayer?.()
  }
  const handleAddLayerText = () => {
    addTextLayer?.()
  }

  return (<div className="w-full border">
    <div className="border-b border-t px-3 py-2 w-full flex justify-between">
      <p>Layers</p>
      <div className="flex gap-2">
        <Button onClick={handleAddLayerImage} title='add image'><FileAddOutlined /></Button>
        <Button onClick={handleAddLayerText} title="add text"><PlusOutlined /> T</Button>
        <Button onClick={handleUndo} title="Undo"><UndoOutlined /></Button>
        <Button onClick={handleRedo} title='redo'><RedoOutlined /></Button>
      </div>
    </div>
    <DndProvider backend={HTML5Backend}>
      <DragDropLayer />
    </DndProvider>
  </div>)
}

export default Layers