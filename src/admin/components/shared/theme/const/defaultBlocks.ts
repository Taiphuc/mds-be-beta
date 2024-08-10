import { BlockType } from "../ThemePage";

export const DEFAULT_BLOCK_LAYOUT: BlockType = {
  id: "",
  children: [],
  data: {
    grid: {
      col: 1,
    },
  },
  name: "layout block",
  type: "layoutChild",
};

export const DEFAULT_BLOCK_BUTTON_LINK: BlockType = {
  id: "",
  children: [],
  data: {
    buttonLink: {
      link: "#",
      text: "Button link",
      title: "",
    },
    border: {
      width: 1,
      radius: 6,
    },
    box: {
      width: "150px",
    },
    background: {
      color: "#121212",
    },
    padding: {
      top: 4,
      right: 8,
      bottom: 4,
      left: 8,
    },
    text: {
      color: "#ffffff",
      transform: "uppercase",
    },
  },
  name: "Button link",
  type: "buttonLink",
};

export const DEFAULT_BLOCK_SLIDER_ITEM = {
  image: "https://demo.vincoleggings.com/template1/images/main-banner-image/banner-new-bg9.jpg",
  title: "Winter-spring 2020!",
  description: "Limited Time Offer!",
  subDescription: "Take 20% Off ‘Sale Must-Haves",
  btn1Title: "Shop Women's",
  btn2Title: "Shop Men's",
  btn1Link: "/store",
  btn2Link: "/store",
};

export const DEFAULT_BLOCK_SLIDER: BlockType = {
  id: "",
  children: [],
  data: {
    box: {
      width: "100%",
      height: "600px",
    },
    slider: {
      settings: {
        slidesPerView: 1,
        autoplay: {
          delay: 6000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        },
        pagination: {
          clickable: true,
        },
        modules: ["Autoplay", "Pagination"],
        spaceBetween: 0,
      },
      items: [DEFAULT_BLOCK_SLIDER_ITEM],
    },
  },
  name: "Slider",
  type: "slider",
};

export const DEFAULT_BLOCK_CATEGORIES: BlockType = {
  id: "",
  children: [],
  data: {
    categories: {
      category1BtnLabel: "Discover now",
      category1BtnLink: "/store",
      category1Image: "https://demo.vincoleggings.com/template1/images/category-product-image/cp-img9.jpg",
      category1SubTitle: "50% OFF",
      category1Title: "Don’t Miss Today’s Featured Deals",
      category2BtnLabel: "Discover now",
      category2BtnLink: "/store",
      category2Image: "https://demo.vincoleggings.com/template1/images/category-product-image/cp-img10.jpg",
      category2Title: "New Personalizable Collection",
      category2SubTitle: "Need It Now",
    },
    box: {
      width: "100%",
    },
    padding: {
      top: 50,
      bottom: 50,
      left: 8,
      right: 8,
    }
  },
  name: "categories",
  type: "categories",
};

export const DEFAULT_PADDING = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const DEFAULT_MARGIN = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const DEFAULT_BORDER = {
  width: 1,
  radius: 0,
  color: "#e5e5e5",
};

export const DEFAULT_SHADOW = {
  horizontal: 0,
  vertical: 0,
  opacity: 100,
  blur: 0,
};

export const DEFAULT_BACKGROUND = {
  color: "transparent",
  image: "",
  size: "cover",
  position: "center",
  repeat: "no-repeat",
};

export const DEFAULT_BOX = {
  width: "100%",
  height: "",
};
