import { Settings } from "src/models/settings";

export function remakeSettings(settings: Settings[]) {
  const result: { [key: string]: { [key: string]: { value: string; id: number } } } = {};
  for (const key in settings) {
    result[settings[key].type] = {
      ...result[settings[key].type],
      [settings[key].key]: {
        value: settings[key].value,
        id: settings[key].id,
      },
    };
  }
  return result;
}
