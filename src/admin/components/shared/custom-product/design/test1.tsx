"use client"
import { FC, useEffect, useState, ChangeEvent } from "react";
import { useDesign1 } from "./useDesign";
import Layers from "./Layers";
import LayerAction from "./LayerAction";
import { useAdminCustomPost, useAdminProducts } from "medusa-react";
import { RouteProps } from "@medusajs/admin";
import { Input } from "@medusajs/ui";

type CreateCustomProductBaseProps = {
  isSave: boolean,
  setIsSave: (isSave: boolean) => void,
} & RouteProps;

const CreateCustomProductBase: FC<CreateCustomProductBaseProps> = ({ setIsSave, isSave, notify }) => {
  const { canvas, config, currentLayer, template, getSaveData, setCanvas, product, setProduct, data } = useDesign1()
  const [query, setQuery] = useState('')
  const { products } = useAdminProducts({ limit: 4, ...(query ? { q: query } : {}) })
  const { mutate: upload, isLoading: isLoadingUpload } = useAdminCustomPost<any, any>(`/media/upload`, []);
  const { mutate: createProductBase, isLoading: isLoadingCreateProductBase } = useAdminCustomPost<any, any>(`/custom-product-base`, []);

  const handleSave = () => {
    canvas?.discardActiveObject();
    canvas?.zoomToPoint({ x: canvas?.width / 2, y: canvas?.height / 2 }, 1);
    canvas?.setBackgroundColor('transparent', () => { });
    canvas?.renderAll();
    const dataUrl = canvas.toDataURL({
      left: template.left,
      top: template.top,
      height: template.height,
      width: template.width,
      format: 'image/png',
      enableRetinaScaling: true,
      quality: 1,
    })

    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        if (blob) formData.append("files", blob, 'product-base.png');
        upload(formData, {
          onSuccess: (res) => {
            const saveData = getSaveData?.()
            createProductBase({ ...saveData, thumbnail: res?.url, productId: product?.id, ...(data ? { id: data?.id } : {}) }, {
              onSuccess: () => {
                notify.success('Success', "Created Successfully")
              },
              onError: () => {
                notify.error('Failed', "Create Failed")
              }
            })
          },
          onError: (err) => {
            console.log("upload err", err);
          }
        })
      })
    setIsSave(false);
    setCanvas?.(undefined)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleChange = (value, option) => {
    setProduct(option)
  }

  useEffect(() => {
    if (isSave) {
      handleSave()
    }
  }, [isSave])

  return (
    <div className="w-full h-full">
      <div className="w-full grid grid-cols-2 gap-4 h-full">
        <div className="w-full h-full flex justify-center items-center bg-fuchsia-300 overflow-auto relative" id="container-c">
          <canvas id="canvas" className="overflow-auto"></canvas>
          <div className="absolute border p-3 bottom-5 right-5 w-[80px] text-center bg-white font-bold">{(config?.zoom * 100).toFixed(0)} %</div>
        </div>

        <div className="w-full p-5 flex gap-5 flex-col items-start ">
          <Layers />
          {!!currentLayer && <LayerAction />}
          <div className="w-full my-2 flex flex-wrap gap-3 items-center">
            <p>Choice Target Product: </p>
            <div className="w-[400px]">
              <Input placeholder="Select a product" value={query} onChange={handleSearch} />
              <div className=" py-3">
                {query && products?.map((d) => (
                  <div className="w-[50%] border px-2 py-1" key={d.id}>
                    <div className="flex w-full gap-4 items-center cursor-pointer hover:bg-[#eceeee]" onClick={() => { handleChange(d.id, { title: d.title, id: d.id, thumbnail: d.thumbnail }), setQuery('') }}>
                      <img src={d?.thumbnail} alt="" width={40} height={40} /> <p className="truncate">{d.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex gap-4 items-center cursor-pointer hover:bg-[#eceeee]">
                <img src={product?.thumbnail} alt="" width={40} height={40} /> <p className="truncate">{product?.title}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CreateCustomProductBase