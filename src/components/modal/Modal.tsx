import { cloneElement, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutSideClick";
import CloseIcon from "../../icons/Close";
import IconWrapper from "../IconWrapper";
import type { ModalProps, OpenProps, WindowProps } from "./type";
import { ModalContext, useModal } from "./ModalContext";

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return <ModalContext.Provider value={{ openName, close, open }}>{children}</ModalContext.Provider>;
}

function Open({ children, opens: opensWindowName, stopClickPropagation = false }: OpenProps) {
  const { open } = useModal();
  const handleClick = (e: MouseEvent) => {
    if (stopClickPropagation) {
      e.stopPropagation();
    }
    open(opensWindowName);
  };
  return cloneElement(children, { onClick: handleClick });
}

function Window({ children, name }: WindowProps) {
  const { openName, close } = useModal();
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div id={name} className="fixed top-0 left-0 w-full h-[100vh] z-[1000] transition-all duration-500">
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
