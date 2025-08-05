import React from "react";
import { useDragLayer, type XYCoord } from "react-dnd";
import DateObject from "react-date-object";

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

  // محاسبه میزان جابجایی ماوس از نقطه شروع
  const deltaX = currentPointerOffset.x - initialPointerOffset.x;
  const deltaY = currentPointerOffset.y - initialPointerOffset.y;

  // موقعیت نهایی = موقعیت اولیه آیتم + میزان جابجایی ماوس
  const x = initialSourceOffset.x + deltaX;
  const y = initialSourceOffset.y + deltaY;
  const transform = `translate(${x}px, ${y}px)`;

  return { transform };
}

export const CustomDragLayer = () => {
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

  const startDay = new DateObject(startDate).set({ hour: 0, minute: 0, second: 0 });
  const endDay = new DateObject(endDate).set({ hour: 0, minute: 0, second: 0 });

  const durationInSeconds = endDay.toUnix() - startDay.toUnix();

  const durationInDays = Math.round(durationInSeconds / 86400) + 1;

  const previewWidth = `${durationInDays * (100 / 8.5)}%`;

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
