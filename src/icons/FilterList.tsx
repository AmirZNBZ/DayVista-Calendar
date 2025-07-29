import clsx from "clsx";
import React from "react";
type svgProps = React.SVGAttributes<SVGElement> | undefined;

const FilterListIcon = (props: svgProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width || 24}
      height={props?.height || 24}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(props?.className || "")}
    >
      <path
        fill={props?.fill || "currentColor"}
        d="M11 18h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1m4 6h10c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1"
      ></path>
    </svg>
  );
};

export default FilterListIcon;
