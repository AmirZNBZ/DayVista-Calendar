import React from "react";
import { useDragLayer } from "react-dnd";
import DateObject from "react-date-object";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(
  initialOffset: { x: number; y: number } | null,
  currentOffset: { x: number; y: number } | null
) {
  if (!initialOffset || !currentOffset) {
    return { display: "none" };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return { transform };
}

export const CustomDragLayer = () => {
  const { item, itemType, isDragging, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
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
      <div style={getItemStyles(initialOffset, currentOffset)}>
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
