import clsx from "clsx";
import React from "react";

type svgProps = React.SVGAttributes<SVGAElement> | undefined;

const ThinArrowRightIcon = (props: svgProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width || 24}
      height={props?.height || 24}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(props?.className || "")}
    >
      <path
        d="m10 17l5-5l-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={props?.fill || "none"}
        strokeWidth={props?.strokeWidth || 1}
        stroke={props?.stroke || "currentColor"}
      ></path>
    </svg>
  );
};

export default ThinArrowRightIcon;
