import clsx from "clsx";
import React from "react";
type SvgProps = React.SVGAttributes<SVGElement> | undefined;

const AgendaViewIcon = (props: SvgProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width || "20"}
      height={props?.height || "20"}
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(props?.className || "")}
    >
      <path
        fill={props?.color || "currentColor"}
        d="M21 17.75A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5A3.25 3.25 0 0 1 21 6.25zm-1.5 0V6.25a1.75 1.75 0 0 0-1.75-1.75H6.25A1.75 1.75 0 0 0 4.5 6.25v11.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75m-2.5-10a.75.75 0 0 1-.648.743l-.102.007h-8.5a.75.75 0 0 1-.102-1.493L7.75 7h8.5a.75.75 0 0 1 .75.75m0 8.5a.75.75 0 0 1-.648.743L16.25 17h-8.5a.75.75 0 0 1-.102-1.493l.102-.007h8.5a.75.75 0 0 1 .75.75M17 12a.75.75 0 0 1-.648.743l-.102.007h-8.5a.75.75 0 0 1-.102-1.493l.102-.007h8.5A.75.75 0 0 1 17 12"
      />
    </svg>
  );
};
export default AgendaViewIcon;
