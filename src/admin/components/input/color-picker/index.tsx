import { FC, useState, useEffect, ChangeEvent } from "react";

type ColorPicker = {
  title: string;
  name: string;
  defaultColor: string;
  description?: string;
  onColorChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const ColorPicker: FC<ColorPicker> = ({ title, defaultColor, description, onColorChange, name }) => {
  const [color, setColor] = useState(defaultColor);

  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    onColorChange(e);
  };

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <div className="w-full flex gap-2">
      <input type="color" value={color} name={name} onChange={handleChangeColor} />
      <div>
        <p className="font-bold">{title}</p>
        <p>{color}</p>
        {!!description &&<p>{description}</p>}
      </div>
    </div>
  );
};

export default ColorPicker;
