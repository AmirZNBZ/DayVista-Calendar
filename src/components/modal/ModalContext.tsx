import { createContext, useContext } from "react";
import type { ModalContextType } from "./type";

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error("Modal components must be used within a Modal provider");
  }
  return context;
}
