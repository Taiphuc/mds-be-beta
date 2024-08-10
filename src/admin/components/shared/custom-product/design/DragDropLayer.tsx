import { FC, useCallback } from "react";
import { useDesign1 } from "./useDesign";
import update from 'immutability-helper'
import LayerItem from "./LayerItem";

type DragDropLayerProps = {};

const DragDropLayer: FC<DragDropLayerProps> = ({ }) => {
  const { layers, setLayers, canvas } = useDesign1();

  const moveLayer = useCallback((dragIndex: number, hoverIndex: number) => {
    setLayers?.((prevLayers: DESIGN.Layer[]) => {
      const dragLayer = layers[dragIndex];
      const hoverLayer = layers[hoverIndex];
      let dragObject = {} as fabric.Object;
      let hoverObject = {} as fabric.Object;
      canvas?.getObjects()?.forEach((obj) => {
        if (obj?.name === dragLayer.id) { dragObject = obj; }
        if (obj?.name === hoverLayer.id) { hoverObject = obj }
      })
      canvas?.moveTo(dragObject, -hoverIndex);
      canvas?.moveTo(hoverObject, -dragIndex);
      canvas?.renderAll()
      const updatedLayers = update(prevLayers, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevLayers[dragIndex] as DESIGN.Layer],
        ],
      }) as DESIGN.Layer[];
      return updatedLayers;
    });
  }, [layers]);

  const renderCard = useCallback(
    (layer: DESIGN.Layer, index: number) => {
      return (
        <LayerItem
          key={layer.id}
          index={index}
          layer={layer}
          moveLayer={moveLayer}
        />
      );
    },
    [moveLayer]
  );

  return (
    <div className="w-full">
      {layers?.map((layer, i) => renderCard(layer, i))}
    </div>
  );
};

export default DragDropLayer;
