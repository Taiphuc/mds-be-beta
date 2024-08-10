import { FC, ChangeEvent } from "react";
import InputRange from "../../input/range";

type ThemeSettingButtonsProps = { themeSettings: any; setThemeSettings: (e: any) => void };

const ThemeSettingButtons: FC<ThemeSettingButtonsProps> = ({ themeSettings, setThemeSettings }) => {
  const handleChangeBorder = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTheme = { ...themeSettings };
    newTheme.button.border[name] = value;
    setThemeSettings(newTheme);
  };

  const handleChangeShadow = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTheme = { ...themeSettings };
    newTheme.button.shadow[name] = value;
    setThemeSettings(newTheme);
  };

  return (
    <div className="pb-6 flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <p className="w-full font-bold text-[18px]">Border</p>
        <div className="grid gap-2 grid-cols-3 w-full">
          <InputRange
            title="Thickness"
            name="thickness"
            min="0"
            max="12"
            step="1"
            onChange={handleChangeBorder}
            value={themeSettings?.button?.border?.thickness}
            suffix="px"
          />

          <div>
            <InputRange
              title="Opacity"
              name="opacity"
              min="0"
              max="100"
              step="1"
              onChange={handleChangeBorder}
              value={themeSettings?.button?.border?.opacity}
              suffix="%"
            />
          </div>

          <div>
            <InputRange
              title="Conner Radius"
              name="connerRadius"
              min="0"
              max="40"
              step="2"
              onChange={handleChangeBorder}
              value={themeSettings?.button?.border?.connerRadius}
              suffix="px"
            />
            z
          </div>
        </div>

        <p className="w-full font-bold text-[18px]">Shadow</p>
        <div className="grid gap-2 grid-cols-3 w-full">
          <div>
            <InputRange
              title="Opacity"
              name="opacity"
              min="0"
              max="100"
              step="1"
              onChange={handleChangeShadow}
              value={themeSettings?.button?.shadow?.opacity}
              suffix="%"
            />
          </div>

          <div>
            <InputRange
              title="Horizontal offset"
              name="horizontalOffset"
              min="-12"
              max="12"
              step="1"
              onChange={handleChangeShadow}
              value={themeSettings?.button?.shadow?.horizontalOffset}
              suffix="px"
            />
          </div>

          <div>
            <InputRange
              title="Vertical offset"
              name="verticalOffset"
              min="-12"
              max="12"
              step="1"
              onChange={handleChangeShadow}
              value={themeSettings?.button?.shadow?.verticalOffset}
              suffix="px"
            />
          </div>

          <div>
            <InputRange
              title="Blur"
              name="bur"
              min="0"
              max="20"
              step="5"
              onChange={handleChangeShadow}
              value={themeSettings?.button?.shadow?.blur}
              suffix="px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemeSettingButtons;
