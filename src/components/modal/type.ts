import type { ReactElement } from "react";

export interface ModalProps {
  children: React.ReactNode;
}

export interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export interface OpenProps {
  children: ReactElement<{ onClick?: () => void }>;
  opens: string;
}

export interface WindowProps {
  children: ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}
