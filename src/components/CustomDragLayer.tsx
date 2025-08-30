import React from "react";
import { useDragLayer, type XYCoord } from "react-dnd";
import DateObject from "react-date-object";
import { getDayBoundary } from "../helpers/getDayBoundary";
import { useCalendarStore } from "../store/calendarStore";

const layerStyles: React.CSSProperties = {
  top: 0,
  left: 0,
  zIndex: 100,
  width: "100%",
  height: "100%",
  position: "fixed",
  pointerEvents: "none",
};

function getItemStyles(
  initialSourceOffset: XYCoord | null,
  initialPointerOffset: XYCoord | null,
  currentPointerOffset: XYCoord | null
) {
  if (!initialSourceOffset || !initialPointerOffset || !currentPointerOffset) {
    return { display: "none" };
  }

  const deltaX = currentPointerOffset.x - initialPointerOffset.x;
  const deltaY = currentPointerOffset.y - initialPointerOffset.y;

  const x = initialSourceOffset.x + deltaX;
  const y = initialSourceOffset.y + deltaY;

  let transform = `translate(${x}px, ${y}px)`;

  const isRtl = document.documentElement.dir === "rtl";
  if (isRtl) {
    transform += "translateX(-90%)";
  }

  return { transform };
}

export const CustomDragLayer = () => {
  const { viewType } = useCalendarStore();
  const { item, itemType, isDragging, currentPointerOffset, initialPointerOffset, initialSourceOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      isDragging: monitor.isDragging(),
      currentPointerOffset: monitor.getClientOffset(),
      initialPointerOffset: monitor.getInitialClientOffset(),
      initialSourceOffset: monitor.getInitialSourceClientOffset(),
    }));

  if (!isDragging || itemType !== "event") {
    return null;
  }

  const startDate = new DateObject(item.start);
  const endDate = new DateObject(item.end);

  const startDay = getDayBoundary(startDate, "start").toUnix();
  // TODO : new DateObject(endDate).set({ hour: 0, minute: 0, second: 0 }); Changed to 23:59:59
  const endDay = getDayBoundary(endDate, "end").toUnix();

  const durationInSeconds = endDay - startDay;

  const durationInDays = Math.round(durationInSeconds / 86400) + 1;

  const previewWidth =
    viewType === "Month" ? `${durationInDays * (100 / 12.5)}%` : `${durationInDays * (100 / 15.5)}%`;

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialSourceOffset, initialPointerOffset, currentPointerOffset)}>
        <div
          style={{ backgroundColor: item.color, width: previewWidth }}
          className="rounded px-1 text-sm text-white opacity-75"
        >
          <span className="font-bold">{item.title}</span>
        </div>
      </div>
    </div>
  );
};
