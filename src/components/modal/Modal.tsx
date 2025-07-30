import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutSideClick";
import CloseIcon from "../../icons/Close";
import IconWrapper from "../IconWrapper";
import type { ModalContextType, ModalProps, OpenProps, WindowProps } from "./type";

const ModalContext = createContext<ModalContextType | null>(null);

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>;
}

function useModal() {
  const context = useContext(ModalContext);
  if (context === null) {
    throw new Error("Modal components must be used within a Modal provider");
  }
  return context;
}

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useModal();
  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }: WindowProps) {
  const { openName, close } = useModal();
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-[100vh] z-[1000] transition-all duration-500">
      <div
        className="fixed top-1/2 left-1/2 transform -translate-1/2 bg-white border border-amber-100/50 rounded-lg shadow-lg py-[3.2rem] px-16 transition-all duration-500"
        ref={ref}
      >
        <button
          className="bg-transparent border-none p-2 rounded-sm translate-x-3 absolute top-5 right-5 hover:bg-gray-100 pointer"
          onClick={close}
        >
          <IconWrapper>
            <CloseIcon />
          </IconWrapper>
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
