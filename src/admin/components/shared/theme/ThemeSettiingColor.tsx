import { FC, ChangeEvent } from "react";
import ColorPicker from "../../input/color-picker";

type ThemeSettingColorProps = {themeSettings: any, setThemeSettings: (e:any)=> void};
const ThemeSettingColor: FC<ThemeSettingColorProps> = ({setThemeSettings, themeSettings}) => {
  const handleChangePrimaryColor = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target
    const newSettings = {...themeSettings}
    newSettings.colors.primary[name] = value
    setThemeSettings(newSettings)
  }

  const handleChangeSecondaryColor = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = e.target
    const newSettings = {...themeSettings}
    newSettings.colors.secondary[name] = value
    setThemeSettings(newSettings)
  }

  return (
    <div className="pb-6 flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <p className="w-full font-bold text-[18px]">Primary colors</p>
        <div className="grid gap-2 grid-cols-3">
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.text}
              title="Color of text in Button"
              description="Used as foreground color on accent colors"
              name="text"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.background}
              title="Background color"
              description="Used for solid button background."
              name="background"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.borderColor}
              title="Border color"
              description="Used for solid button border."
              name="borderColor"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.hoverText}
              title="Hover text"
              name="hoverText"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.hoverBackground}
              title="Hover background color"
              name="hoverBackground"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.primary.hoverBorderColor}
              title="Hover border color"
              name="hoverBorderColor"
              onColorChange={handleChangePrimaryColor}
            />
          </div>
        </div>

        <p className="w-full font-bold text-[18px]">Secondary colors</p>
        <div className="grid gap-2 grid-cols-3">
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.text}
              title="Color of text in Button"
              description="Used as foreground color on accent colors"
              name="text"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.background}
              title="Background color"
              description="Used for solid button background."
              name="background"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.borderColor}
              title="Border color"
              description="Used for solid button border."
              name="borderColor"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.hoverText}
              title="Hover text"
              name="hoverText"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.hoverBackground}
              title="Hover background color"
              name="hoverBackground"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
          <div>
            <ColorPicker
              defaultColor={themeSettings.colors.secondary.hoverBorderColor}
              title="Hover border color"
              name="hoverBorderColor"
              onColorChange={handleChangeSecondaryColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemeSettingColor;
