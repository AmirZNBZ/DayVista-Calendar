import clsx from "clsx";
import React from "react";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const IconWrapper = ({ children, className }: IconWrapperProps) => {
  return <div className={clsx(className || "")}>{children}</div>;
};

export default IconWrapper;
