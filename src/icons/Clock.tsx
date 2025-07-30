import clsx from "clsx";
import React from "react";

type SvgProps = React.SVGAttributes<SVGElement> | undefined;

const ClockIcon = (props: SvgProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width || 24}
      height={props?.height || 24}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(props?.className || "")}
    >
      <path
        fill={props?.color || "currentColor"}
        d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"
      />
    </svg>
  );
};

export default ClockIcon;
