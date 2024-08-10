import { FC, ChangeEvent } from "react";
import { FONT_LIST, FONT_LIST_OBJECT } from "./const/fontList";
import { Select } from "@medusajs/ui";
import InputRange from "../../input/range";

type ThemeSettingTypographyProps = { themeSettings: any; setThemeSettings: (e: any) => void };
const ThemeSettingTypography: FC<ThemeSettingTypographyProps> = ({ themeSettings, setThemeSettings }) => {
  const handleChangeHeading = (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newSettings = { ...themeSettings };
    newSettings.typography.heading[name] = value;
    setThemeSettings(newSettings);
  };

  const handleChangeBody = (e: ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const newSettings = { ...themeSettings };
    newSettings.typography.body[name] = value;
    setThemeSettings(newSettings);
  };

  return (
    <div className="pb-6 flex flex-col gap-2">
      <div className="grid gap-2 grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="w-full font-bold text-[18px]">Headings</p>
          <p>Font</p>
          <div className="w-1/2">
            <Select
              value={FONT_LIST_OBJECT?.[themeSettings?.typography?.heading?.font]?.value}
              onValueChange={(value) => handleChangeHeading({ target: { name: "font", value } })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {FONT_LIST.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <InputRange
            title="Font size scale"
            name="sizeScale"
            min="100"
            max="150"
            step="5"
            onChange={handleChangeHeading}
            value={themeSettings?.typography?.heading?.sizeScale}
            suffix="%"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="w-full font-bold text-[18px]">Body</p>
          <p>Font</p>
          <div className="w-1/2">
            <Select
              value={FONT_LIST_OBJECT?.[themeSettings?.typography?.body?.font]?.value}
              onValueChange={(value) => handleChangeBody({ target: { name: "font", value } })}
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {FONT_LIST.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <InputRange
            title="Font size scale"
            name="sizeScale"
            min="100"
            max="150"
            step="5"
            onChange={handleChangeBody}
            value={themeSettings?.typography?.body?.sizeScale}
            suffix="%"
          />
        </div>
      </div>
    </div>
  );
};
export default ThemeSettingTypography;
