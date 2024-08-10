import { ChangeEvent, FC, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from 'dnd-core'
import { useDesign1 } from "./useDesign";

type LayerItemProps = {
  layer: DESIGN.Layer,
  index: number,
  moveLayer: (dragIndex: number, hoverIndex: number) => void
};

interface DragItem {
  index: number
  id: string
  type: string
}


const LayerItem: FC<LayerItemProps> = ({ index, layer, moveLayer }) => {
  const { currentLayer, setCurrentLayer, canvas, layers, setLayers } = useDesign1()
  const [isEditName, setIsEditName] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeRef = useRef<any>()
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'layer',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveLayer(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'layer',
    item: () => {
      return { id: layer.id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  const handleOnclick = () => {
    setCurrentLayer?.(layer);
    const currentObject = canvas?.getObjects()?.find((obj) => {
      return obj?.name === layer?.id
    })
    if (currentObject) {
      canvas?.setActiveObject(currentObject)
      canvas?.renderAll()
    }
  }

  const handleClickTitle = () => {
    setIsEditName(true)
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeRef?.current);
    timeRef.current = setTimeout(() => {
      const newLayers = layers?.map((layer) => {
        if (layer?.id === currentLayer?.id) {
          return { ...layer, title: e.target.value }
        }
        return layer
      })
      setLayers?.(newLayers)
    }, 400)
  }

  return (
    <div
      onClick={handleOnclick}
      ref={ref} style={{ opacity }} data-handler-id={handlerId}
      className={`w-full px-3 py-2 border-b border-[#fff] hover:bg-[#fce7e7] hover:cursor-pointer flex flex-wrap justify-between ${layer?.id === currentLayer?.id ? 'bg-[#fad6d6]' : 'bg-[#f7f7f7]'}`}>
      <div onClick={handleClickTitle} className="w-[400px] truncate" title={layer?.title}>
        {!isEditName && layer?.title}
        {isEditName &&
          <input
            defaultValue={layer?.title}
            onChange={handleChangeTitle}
            autoFocus
            onBlur={() => setIsEditName(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditName(false); } }}
          />}
      </div>
      <div>ID {layer?.id}</div>
    </div>
  )
}

export default LayerItem