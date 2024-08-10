import { FC, ChangeEvent } from "react";
type InputRangeProps = {
  title: string;
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  min: string;
  max: string;
  step: string;
  suffix: string;
};
const InputRange: FC<InputRangeProps> = ({ title, name, onChange, value, max, min, step, suffix }) => {
  return (
    <div>
      <p>{title}</p>
      <div className="flex gap-2">
        <input name={name} type="range" min={min} max={max} step={step} onChange={onChange} value={value} />
        <div className="border rounded-md px-3 py-1">
          {value} {suffix}
        </div>
      </div>
    </div>
  );
};
export default InputRange;
