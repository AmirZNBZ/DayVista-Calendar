import React, { useMemo } from "react";
import clsx from "clsx";
import { useDrop } from "react-dnd";
import DateObject from "react-date-object";
import { useEventStore } from "../../store/eventStore";

interface TimeSlotProps {
  day: DateObject;
  slotIndex: number; // 0 to 47
  onEventDrop: (eventId: string, newStartDate: DateObject) => void;
  children: React.ReactNode;
}

const TimeSlot = ({ day, slotIndex, onEventDrop, children }: TimeSlotProps) => {
  const { draggedEventInfo, dropTargetDate, setDropTargetDate, setActiveDropZone } = useEventStore();

  const slotDate = useMemo(() => {
    const hour = Math.floor(slotIndex / 2);
    const minute = (slotIndex % 2) * 30;
    return new DateObject(day).set({ hour, minute, second: 0 });
  }, [day, slotIndex]);

  const [{ isOver }, dropRef] = useDrop({
    accept: "event",
    drop: (item: { id: string }) => {
      onEventDrop(item.id, slotDate);
    },
    hover: () => {
      setActiveDropZone("timed");
      if (!dropTargetDate || dropTargetDate.toUnix() !== slotDate.toUnix()) {
        setDropTargetDate(slotDate);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const shouldHighlight = useMemo(() => {
    if (!draggedEventInfo || !dropTargetDate || draggedEventInfo.allDay) {
      return false;
    }

    const currentSlotUnix = slotDate.toUnix();
    const dropStartUnix = dropTargetDate.toUnix();
    const dropEndUnix = dropStartUnix + draggedEventInfo.duration;

    return currentSlotUnix >= dropStartUnix && currentSlotUnix < dropEndUnix;
  }, [draggedEventInfo, dropTargetDate, slotDate]);

  const isHalfHour = slotIndex % 2 !== 0;

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className={clsx(
        "h-8 relative group",
        !isHalfHour && "border-t border-gray-200",
        // هایلایت کردن خانه بر اساس وضعیت drag
        (isOver || shouldHighlight) && "bg-green-100/70"
      )}
    >
      {/* {isHalfHour && <div className="border-t border-dashed border-gray-300" />} */}
      {/* children همون Modal.Open هست که از قبل داشتیم */}
      {children}
    </div>
  );
};

export default TimeSlot;
