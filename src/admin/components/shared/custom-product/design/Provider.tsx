import { fabric } from 'fabric';
import { ReactElement, createContext, useEffect, useRef, useState } from "react";
import { WHToPx } from "./convert";
import FontFaceObserver from 'fontfaceobserver';
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"

export type TemplateType = {
  title: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

export type Histories = {
  current: number;
  data: any[];
  undo?: () => void;
  redo?: () => void;
}

export type Design1ContextType = {
  layers: DESIGN.Layer[]
  currentLayer?: DESIGN.Layer
  setCurrentLayer?: (e?: DESIGN.Layer) => void
  config: DESIGN.Config
  setConfig?: (config: DESIGN.Config) => void
  setLayers?: (layers: any) => void
  canvas?: fabric.Canvas,
  setCanvas?: (canvas: fabric.Canvas) => void
  template?: TemplateType;
  setTemplate?: (e: TemplateType) => void
  createRootCanvas?: (mm: number, ppt: number) => void
  histories?: Histories;
  addImageLayer?: (url?: string, c?: any, currentTemplate?: any) => void
  addTextLayer?: () => void
  loadAndUseFont?: (e: string) => void
  getSaveData?: () => any
  product?: any,
  setProduct?: (e: any) => void,
  data?: any
}

export const Design1Context = createContext<Design1ContextType>({
  config: {
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0,
    currentMenu: 'layer'
  },
  layers: [],
})

const Design1Provider = ({ children, data }: { children: ReactElement, data?: any }) => {
  const [product, setProduct] = useState<any>()
  const [layers, setLayers] = useState<DESIGN.Layer[]>([])
  const { mutateAsync: getImage } = useAdminCustomPost<any, any>("/image", [])
  const [template, setTemplate] = useState<TemplateType>()
  const [currentLayer, setCurrentLayer] = useState<DESIGN.Layer>()
  const [histories, setHistories] = useState<Histories>({ current: 0, data: [] })
  const [currentIndexAdded, setCurrentIndexAdded] = useState<number>(0)
  const [config, setConfig] = useState({
    color: 'Black',
    placement: 'front',
    color_code: '#000000',
    zoom: 0,
    currentMenu: 'layer'
  })
  const [canvas, setCanvas] = useState<fabric.Canvas>()
  const loadState = (data: any) => {
    canvas?.loadFromJSON(data?.canvas, function () {
      canvas.getObjects()?.forEach((obj, i) => {
        obj.name = layers[i].id
      })
      canvas?.renderAll();
      setCanvas(canvas);
      setLayers(data?.layers)
    });
  }

  const undo = () => {
    if (histories.current > 0) {
      const current = histories.current - 1;
      loadState(histories?.data[current]);
      setHistories({ ...histories, current })
    }
  }

  const redo = () => {
    if (histories.current < histories.data.length - 1) {
      const current = histories.current + 1;
      loadState(histories?.data[current]);
      setHistories({ ...histories, current })
    }
  }

  const addImageLayer = (url = "http://localhost:9000/uploads/default-design.png", c = canvas, currentTemplate = template) => {
    const name = currentIndexAdded.toString()
    setCurrentIndexAdded(currentIndexAdded + 1)
    const newLayer: DESIGN.Layer = {
      id: name,
      image: url,
      title: "Print area",
      metadata: {},
      optionType: "locked",
      type: 'image',
      top: currentTemplate?.top,
      left: currentTemplate?.left,
    }
    getImage({ url }, {
      onSuccess: (res) => {
        fabric.Image.fromURL(res.data, (res) => {
          const image = res.set({ name: name, top: newLayer.top, left: newLayer.left });
          setLayers([newLayer, ...layers])
          c?.add(image);
          c?.moveTo(image, layers?.length)
          c?.renderAll()
          const newHistories = { ...histories }
          newHistories.current = newHistories.data.length
          newHistories.data.push({ canvas: c?.toJSON(), layers: [newLayer, ...layers] });
          setHistories(newHistories)
          setCanvas(c)
        })
      }
    })
  }


  const addTextLayer = () => {
    const name = currentIndexAdded.toString()
    setCurrentIndexAdded(currentIndexAdded + 1)
    const newLayer: DESIGN.Layer = {
      id: name,
      image: "",
      title: "Text area",
      metadata: {},
      optionType: "locked",
      type: 'text',
      top: template?.top,
      left: template?.left,
    }
    const text = new fabric.Text('Text area', { name, top: template?.top, left: template?.left, fontFamily: "Open Sans" })
    setLayers([newLayer, ...layers])
    canvas?.moveTo(text, layers?.length)
    const newHistories = { ...histories }
    newHistories.current = newHistories.data.length
    newHistories.data.push({ canvas: canvas?.toJSON(), layers: [newLayer, ...layers] });
    setHistories(newHistories)
    canvas?.add(text)
    setCanvas(canvas)
  }

  const loadAndUseFont = (font: string) => {
    var myfont = new FontFaceObserver(font)
    myfont.load()
      .then(() => {
        // when font is loaded, use it.
        (canvas?.getActiveObject() as fabric.Text)?.set("fontFamily", font);
        canvas?.renderAll();
      }).catch((e: any) => {
        alert('font loading failed ' + font);
      });
  }

  const createRootCanvas = (width: number, height: number, type = 'mm', ppt = 300) => {
    const container = window.document.getElementById("container-c");
    const canvasH = (container?.offsetHeight || 30) - 30;
    const canvasW = (container?.offsetWidth || 30) - 30
    const templateW = WHToPx(width, type, ppt);
    const templateH = WHToPx(height, type, ppt);
    const templateTop = (canvasH - templateH) / 2;
    const templateLeft = (canvasW - templateW) / 2;
    const zoom = (canvasW / templateW > canvasH / templateH) ? canvasH / templateH : canvasW / templateW

    const c = new fabric.Canvas("canvas", {
      height: canvasH,
      width: canvasW,
      backgroundColor: '#fff',
    });
    var rect = new fabric.Rect({
      top: templateTop,
      left: templateLeft,
      width: templateW,
      height: templateH,
    });
    c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
    c.clipPath = rect;
    const newTemplate = { width: templateW, height: templateH, top: templateTop, left: templateLeft, title: "Sample Template" }
    addImageLayer("http://localhost:9000/uploads/default-design.png", c, newTemplate)
    c.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = c.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
      setConfig({ ...config, zoom: zoom })
      opt.e.preventDefault();
      opt.e.stopPropagation();
      setCanvas(c)
    });

    setConfig({ ...config, zoom: zoom })
    setCanvas(c)
    setTemplate(newTemplate)
  }

  const addLayer = async (layer: DESIGN.Layer, c: fabric.Canvas, i: number, position: any) => {
    if (layer.type === 'image') {
      const resImage = await getImage({ url: layer?.image as string })
      fabric.Image.fromURL(resImage.data, (res) => {
        const image = res.set({ name: layer?.id, ...layer.metadata?.object, top: layer.metadata?.object?.top + position?.top, left: layer.metadata?.object?.left + position?.left });
        c?.add(image);
        c.moveTo(image, i)
      })
      setCanvas(c)
    }
    if (layer.type === 'text') {
      const text = new fabric.Text(layer?.title, { name: layer?.id, ...layer.metadata?.object })
      c?.add(text)
      c.moveTo(text, i)
      setCanvas(c)
    }
  }

  const addLayers = async (layers: DESIGN.Layer[], c: fabric.Canvas, zoom: number, position: any) => {
    for (let i = 0; i < layers?.length; i++) {
      await addLayer(layers[i], c, i, position)
    }
    c.zoomToPoint({ x: (c?.width || 0) / 2, y: (c?.height || 0) / 2 }, zoom);
    c?.renderAll()
  }

  const getSaveData = () => {
    const objs = canvas?.getObjects()
    const data = layers?.map(layer => {
      const obj = objs?.find(o => o.name === layer?.id);

      return {
        ...layer,
        metadata: {
          ...layer.metadata,
          object: {
            "type": obj.type,
            "left": obj.left,
            "top": obj.top,
            "width": obj.width,
            "height": obj.height,
            "fill": obj.fill,
            "scaleX": obj.scaleX,
            "scaleY": obj.scaleY,
            "angle": obj.angle,
            "flipX": obj.flipX,
            "flipY": obj.flipY,
            "opacity": obj.opacity,
            "backgroundColor": obj.backgroundColor,
            "text": (obj as fabric.Text)?.text,
          }
        }
      }
    })
    return {
      template,
      layers: data
    }
  }

  useEffect(() => {
    if (data?.id) {
      setLayers(data.layers)
      const container = window.document.getElementById("container-c");
      const canvasH = (container?.offsetHeight || 30) - 30;
      const canvasW = (container?.offsetWidth || 30) - 30
      const templateW = data?.template?.width;
      const templateH = data?.template?.height;
      const templateTop = (canvasH - templateH) / 2;
      const templateLeft = (canvasW - templateW) / 2;
      const zoom = (canvasW / templateW > canvasH / templateH) ? canvasH / templateH : canvasW / templateW

      const c = new fabric.Canvas("canvas", {
        height: canvasH,
        width: canvasW,
        backgroundColor: '#fff',
      });
      var rect = new fabric.Rect({
        top: templateTop,
        left: templateLeft,
        width: templateW,
        height: templateH,
      });
      c.clipPath = rect;
      const reserved = data?.layers?.reverse()
      addLayers(reserved, c, zoom, {
        top: templateTop - data?.template?.top,
        left: templateLeft - data?.template?.left,
      })
      c.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY;
        var zoom = c.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        c.zoomToPoint({ x: canvasW / 2, y: canvasH / 2 }, zoom);
        setConfig({ ...config, zoom: zoom })
        opt.e.preventDefault();
        opt.e.stopPropagation();
        setCanvas(c)
      });
      c.renderAll();
      setConfig({ ...config, zoom: zoom })
      setCanvas(c)
      setTemplate({ ...data?.template, top: templateTop, left: templateLeft })
      setProduct({ title: data?.product?.title, id: data?.product?.id, thumbnail: data?.product?.thumbnail })
    } else {
      createRootCanvas(100, 100)
    }
  }, [data?.id])

  useEffect(() => {
    canvas?.on('object:modified', () => {
      const newHistories = { ...histories }
      newHistories.data = newHistories?.data?.slice(0, histories.current + 1)
      if (histories?.data?.length < 10) {
        newHistories.current = newHistories.data.length;
        newHistories.data.push({ canvas: canvas?.toJSON(), layers: layers });
      } else {
        newHistories?.data?.shift();
        newHistories.data?.push({ canvas: canvas?.toJSON(), layers: layers });
      }
      setHistories(newHistories);
      setCanvas(canvas);
    })
  }, [histories, layers])

  useEffect(() => {
    canvas?.on('selection:created', (e) => {
      const selected = e.selected?.[0]
      const layer = layers?.find(l => l?.id === selected?.name)
      setCurrentLayer(layer)
    })
  }, [layers])

  useEffect(() => {
    canvas?.on('selection:cleared', (e) => {
      const deselected = e.deselected?.[0]
      if (currentLayer?.id === deselected?.name) {
        setCurrentLayer?.(undefined);
      }
    })
  }, [currentLayer])

  useEffect(() => {
    canvas?.on('selection:updated', (e) => {
      const selected = e.selected?.[0]
      const layer = layers?.find(l => l?.id === selected?.name)
      setCurrentLayer(layer)
    })
  }, [layers])

  return (
    <Design1Context.Provider value={{
      layers: layers, setLayers, config, setConfig, canvas, setCanvas,
      currentLayer, setCurrentLayer, createRootCanvas, histories: { ...histories, undo, redo },
      template,
      addImageLayer,
      addTextLayer,
      loadAndUseFont,
      getSaveData,
      product,
      setProduct,
      data
    }}>
      {children}
    </Design1Context.Provider>
  )
}
export default Design1Provider