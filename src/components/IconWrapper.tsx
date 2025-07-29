import clsx from "clsx";
import React from "react";

interface IconWrapperProps {
  onClickFn?: () => void;
  className?: string;
  children: React.ReactNode;
}

const IconWrapper = ({ children, className, onClickFn }: IconWrapperProps) => {
  return (
    <div onClick={onClickFn} className={clsx(className || "", onClickFn ? "pointer" : "")}>
      {children}
    </div>
  );
};

export default IconWrapper;
