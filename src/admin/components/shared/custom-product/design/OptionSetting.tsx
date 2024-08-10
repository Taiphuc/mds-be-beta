import { FC, ChangeEvent } from "react";
import { useDesign1 } from "./useDesign";

type OptionSettingProps = {};

const OptionSetting: FC<OptionSettingProps> = ({ }) => {
  const { currentLayer, layers, setLayers, setCurrentLayer } = useDesign1();

  const handleAddOption = ({ option = "option", isAdd = false, deleteItem = -1 }) => {
    {
      const newLayers = layers?.map((layer) => {
        if (layer?.id === currentLayer?.id) {

          const temp = {
            ...layer,
            optionType: option
          }

          if (option === 'option') {
            if (deleteItem !== -1) {
              temp.metadata.options = temp?.metadata?.options?.filter((o, i) => i !== deleteItem)
            } else {
              if (isAdd) {
                temp?.metadata?.options?.push({
                  title: 'Title 1',
                  value: "text",
                  image: '',
                })
              } else {
                temp.metadata.options = [{
                  title: 'Title 1',
                  value: "text",
                  image: '',
                }]
              }
            }
          }
          setCurrentLayer?.(temp)
          return temp
        }
        return layer;
      });

      setLayers?.(newLayers);
    }
  }

  const handleChangeOption = (e: ChangeEvent<HTMLInputElement>, i: number)=>{
    const {name, value} = e.target;
    {
      const newLayers = layers?.map((layer) => {
        if (layer?.id === currentLayer?.id) {

          const temp = {
            ...layer
          }
          temp.metadata.options[i] = {...temp.metadata.options[i], [name]: value} 

          setCurrentLayer?.(temp)
          return temp
        }
        return layer;
      });

      setLayers?.(newLayers);
    }
  }

  return (<div className="w-full flex flex-wrap items-start gap-3">
    <div className="w-full flex gap-5">
      <select name="" id="" className="border px-3 py-1" onChange={(e) => {
        handleAddOption({ option: e.target.value })
      }} value={currentLayer?.optionType}>
        <option value="locked">Locked layer</option>
        <option value="option">Option layer</option>
        <option value="upload">Upload image layer</option>
      </select>

      {currentLayer?.optionType === "option" && <button onClick={() => { handleAddOption({ isAdd: true }) }}>Add option</button>}
    </div>

    {currentLayer?.optionType === "option" && <div className="w-full max-h-[150px] overflow-auto flex flex-col gap-3">
      {currentLayer?.metadata?.options?.map((option, i) => {
        return <div className="w-full grid grid-cols-2 gap-3 border p-3" key={i}>
          <div className="flex gap-2 flex-col">
            <div className="w-full flex justify-between items-center">
              <p>Option 1</p>
              <button className="border p-1" 
              onClick={() => { 
                handleAddOption({ deleteItem: i }) 
            }}
              >Delete option</button>
            </div>
            <input className="border px-3 py-1" type="text" name="title" value={option?.title} onChange={(e)=>{handleChangeOption(e, i)}} />
            <input className="border px-3 py-1" type="text" name="value" value={option?.value} onChange={(e)=>{handleChangeOption(e, i)}} />
          </div>
          <div className=""><input type="file" hidden /></div>
        </div>
      })}
    </div>}
  </div>)
}

export default OptionSetting