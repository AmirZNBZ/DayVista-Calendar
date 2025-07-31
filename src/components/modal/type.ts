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
  opens: string;
  stopClickPropagation?: boolean;
  children: ReactElement<{ onClick?: (e: MouseEvent) => void }>;
}

export interface WindowProps {
  children: ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}
