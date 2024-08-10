import { FC, useState, useEffect } from "react";
import { ProgressAccordion } from "@medusajs/ui";
import ThemeSettingColor from "./ThemeSettiingColor";
import { DEFAULT_THEME_SETTINGS } from "./const/defaultTheme";
import ThemeSettingTypography from "./ThemeSettingTypography";
import ThemeSettingButtons from "./ThemeSettingButtons";
import ThemeSettingInput from "./ThemeSettingInput";

type ThemeSettingProps = { theme?: any, updateTheme?: any, setUpdateTheme: (e?:any)=>void };
const ThemeSetting: FC<ThemeSettingProps> = ({ theme, setUpdateTheme, updateTheme }) => {
  const [themeSettings, setThemeSettings] = useState(DEFAULT_THEME_SETTINGS);

  useEffect(() => {
    if (theme?.settings) {
      setThemeSettings(theme.settings);
    }
  }, [theme?.settings]);

  useEffect(()=>{
    setUpdateTheme({...updateTheme, settings: themeSettings});
  }, [themeSettings])
  return (
    <div className="w-full mt-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="Colors">
          <ProgressAccordion.Header>Colors</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <ThemeSettingColor themeSettings={themeSettings} setThemeSettings={setThemeSettings} />
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>

        <ProgressAccordion.Item value="Typography">
          <ProgressAccordion.Header>Typography</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <ThemeSettingTypography themeSettings={themeSettings} setThemeSettings={setThemeSettings} />
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>

        <ProgressAccordion.Item value="Buttons">
          <ProgressAccordion.Header>Buttons</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <ThemeSettingButtons themeSettings={themeSettings} setThemeSettings={setThemeSettings} />
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>

        <ProgressAccordion.Item value="Inputs">
          <ProgressAccordion.Header>Inputs</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <ThemeSettingInput themeSettings={themeSettings} setThemeSettings={setThemeSettings} />
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  );
};
export default ThemeSetting;
