import { useContext } from "react";
import { Design1Context } from "./Provider";

export function useDesign1() {
  const context = useContext(Design1Context);

  if (!context) {
    throw new Error('DesignContext must be used within a DesignContext.Provider');
  }

  return context;
}