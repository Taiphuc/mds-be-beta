import { BlockType } from "../ThemePage";

export const generateStyle = (block: BlockType, defaultValue?: any) => {
  return {
    borderStyle: "solid",
    borderWidth: (block?.data?.border?.width ?? 0) + "px",
    borderColor: block?.data?.border?.color ?? "gray",
    borderRadius: (block?.data?.border?.radius ?? 0) + "px",
    paddingTop: (block?.data?.padding?.top ?? 0) + "px",
    paddingRight: (block?.data?.padding?.right ?? 0) + "px",
    paddingBottom: (block?.data?.padding?.bottom ?? 0) + "px",
    paddingLeft: (block?.data?.padding?.left ?? 0) + "px",
    marginTop: (block?.data?.margin?.top ?? 0) + "px",
    marginRight: (block?.data?.margin?.right ?? 0) + "px",
    marginBottom: (block?.data?.margin?.bottom ?? 0) + "px",
    marginLeft: (block?.data?.margin?.left ?? 0) + "px",
    boxShadow: `${block?.data?.shadow?.horizontal ?? 0}px ${block?.data?.shadow?.vertical ?? 0}px ${
      block?.data?.shadow?.blur ?? 0
    }px rgba(0,0,0,${(block?.data?.shadow?.opacity ?? 100) / 100})`,

    backgroundColor: block?.data?.background?.color ?? "transparent",
    backgroundImage: block?.data?.background?.image ? `url(${block?.data?.background?.image ?? ""})` : "",
    backgroundSize: block?.data?.background?.size ?? "cover",
    backgroundPosition: block?.data?.background?.position ?? "center",
    backgroundRepeat: block?.data?.background?.repeat ?? "no-repeat",

    width: block?.data?.box?.width ?? "100%",
    height: block?.data?.box?.height ?? "",

    color: block?.data?.text?.color ?? "#000000",
    textTransform: block?.data?.text?.transform ?? "none",
  };
};
