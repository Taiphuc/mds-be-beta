export const FONT_LIST = [
  {
    value: "Abel",
    label: "Abel",
  },
  {
    value: "Lato",
    label: "Lato",
  },
  {
    value: "Montserrat",
    label: "Montserrat",
  },
  {
    value: "Open Sans",
    label: "Open Sans",
  },
  {
    value: "Oswald",
    label: "Oswald",
  },
  {
    value: "Roboto",
    label: "Roboto",
  },
  {
    value: "Source Sans 3",
    label: "Source Sans 3",
  },
  {
    value: "Raleway",
    label: "Raleway",
  },
  {
    value: "PT Sans",
    label: "PT Sans",
  },
  {
    value: "Merriweather",
    label: "Merriweather",
  },
  {
    value: "Noto Sans",
    label: "Noto Sans",
  },
  {
    value: "Nunito Sans",
    label: "Nunito Sans",
  },
  {
    value: "Concert One",
    label: "Concert One",
  },
  {
    value: "Prompt",
    label: "Prompt",
  },
  {
    value: "Work_Sans",
    label: "Work_Sans",
  },
];

const convert = () => {
  const obj: { [key: string]: { value: string } } = {};
  FONT_LIST.forEach((e) => {
    obj[e.value] = e;
  });
  return obj;
};

export const FONT_LIST_OBJECT = convert();
