import React, { useMemo } from "react";
import clsx from "clsx";
import { useDrop } from "react-dnd";
import DateObject from "react-date-object";
import { useEventStore } from "../../store/eventStore";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";
import { getDayBoundary } from "../../helpers/getDayBoundary";

interface AllDayCellProps {
  day: DateObject;
  onEventDrop: (eventId: string, newDay: DateObject) => void;
  onAddEvent: (event: any) => void;
}

const AllDayCell = ({ day, onEventDrop, onAddEvent }: AllDayCellProps) => {
  const { dropTargetDate, setDropTargetDate, draggedEventInfo, setActiveDropZone, activeDropZone } =
    useEventStore();

  const [{ isOver }, dropRef] = useDrop({
    accept: "event",
    drop: (item: { id: string }) => onEventDrop(item.id, day),
    hover: () => {
      setActiveDropZone("allday");
      if (!dropTargetDate || dropTargetDate.toUnix() !== day.toUnix()) {
        setDropTargetDate(day);
      }
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  const shouldHighlight = useMemo(() => {
    if (activeDropZone !== "allday") return false;

    if (!draggedEventInfo || !dropTargetDate) return false;

    const currentCellDate = getDayBoundary(day, "start");
    const dropTargetDay = getDayBoundary(dropTargetDate, "start");

    // اگر رویداد در حال کشیدن از نوع all-day است، بازه زمانی را هایلایت کن
    if (draggedEventInfo.allDay) {
      const durationInDays = Math.ceil(draggedEventInfo.duration / 86400);
      const dropEndDate = new DateObject(dropTargetDay).add(durationInDays - 1, "days");

      return (
        currentCellDate.toUnix() >= dropTargetDay.toUnix() && currentCellDate.toUnix() <= dropEndDate.toUnix()
      );
    } else {
      // اگر رویداد در حال کشیدن از نوع زمان‌دار است، فقط خود خانه هدف را هایلایت کن
      return currentCellDate.toUnix() === dropTargetDay.toUnix();
    }
  }, [draggedEventInfo, dropTargetDate, day, activeDropZone]);

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className={clsx(
        "border-l border-gray-200 p-1 h-full",
        (isOver || shouldHighlight) && "bg-green-100/70"
      )}
    >
      <Modal.Open opens={day.toString()} stopClickPropagation={true}>
        <div className="h-full w-full cursor-pointer"></div>
      </Modal.Open>
      <Modal.Window name={day.toString()}>
        <AddEventForm
          onAdd={onAddEvent}
          initialEvent={{
            allDay: true,
            start: day.format("YYYY/MM/DD - HH:mm"),
            end: getDayBoundary(day, "end"),
          }}
        />
      </Modal.Window>
    </div>
  );
};

export default AllDayCell;
