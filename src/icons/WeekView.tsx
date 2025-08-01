import clsx from "clsx";
import React from "react";

type svgProps = React.SVGAttributes<SVGAElement> | undefined;

const WeekViewIcon = (props: svgProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width || "20"}
      height={props?.height || "20"}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(props?.className || "")}
    >
      <g fill="none">
        <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
        <path
          fill={props?.color || "currentColor"}
          d="M19 3a2 2 0 0 1 1.995 1.85L21 5v14a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm0 2H5v14h14zM8 7a1 1 0 0 1 .993.883L9 8v8a1 1 0 0 1-1.993.117L7 16V8a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m4 0a1 1 0 0 1 .993.883L17 8v8a1 1 0 0 1-1.993.117L15 16V8a1 1 0 0 1 1-1"
        />
      </g>
    </svg>
  );
};

export default WeekViewIcon;
