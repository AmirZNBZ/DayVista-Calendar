import clsx from "clsx";
import React from "react";
type svgProps = React.SVGAttributes<SVGElement> | undefined;

const TrashIcon = (props: svgProps) => {
  return (
    <svg
      width={props?.width || 24}
      height={props?.height || 24}
      className={clsx(props?.className || "")}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill={props?.fill || "currentColor"}
        d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
      ></path>
    </svg>
  );
};

export default TrashIcon;
