import clsx from "clsx";
import Modal from "./modal/Modal";
import { useDrop } from "react-dnd";
import React, { useMemo } from "react";
import AddEventForm from "./AddEventForm";
import { useEventStore } from "../store/eventStore";
import DayEventsList from "./month-view/DayEventsList";
import type { CalendarEvent, EventSegment } from "../types/globalTypes";
import DateObject, { type Calendar, type Locale } from "react-date-object";

interface CalendarCellProps {
  cellData: {
    date: string;
    dayNumber: number;
    key: number | string;
    isCurrentMonth: boolean;
  };
  locale: Locale;
  events: EventSegment[];
  calendar: Omit<Calendar, "leapsLength">;
  onAddEvent: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newDate: string) => void;
}

const CalendarCell = ({ cellData, events, onEventDrop, onAddEvent, calendar, locale }: CalendarCellProps) => {
  const { key, dayNumber, isCurrentMonth, date } = cellData;
  const { draggedEventInfo, dropTargetDate, setDropTargetDate } = useEventStore();

  const [{ isOver }, dropRef] = useDrop({
    accept: "event",
    drop: (item: { id: string }) => {
      onEventDrop(item.id, date);
    },
    hover: () => {
      if (dropTargetDate !== date) {
        setDropTargetDate(date);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const shouldHighlight = useMemo(() => {
    if (!draggedEventInfo || !dropTargetDate) return false;

    const currentCellDate = new DateObject({ date, calendar, locale });
    const dropStartDate = new DateObject({ date: dropTargetDate, calendar, locale });
    const dropEndDate = new DateObject(dropStartDate).add(draggedEventInfo.duration, "second");

    return (
      currentCellDate.toUnix() >= dropStartDate.toUnix() && currentCellDate.toUnix() <= dropEndDate.toUnix()
    );
  }, [draggedEventInfo, dropTargetDate, date, calendar, locale]);

  return (
    <React.Fragment key={key}>
      <Modal.Open opens={key.toString()} key={key}>
        <td
          ref={dropRef as unknown as React.Ref<HTMLTableCellElement>}
          key={key}
          data-no-outside-click
          className={clsx(
            "active:bg-purple-200/20 select-none min-h-28 h-28 p-1 align-top border border-orange-400",
            isOver && "bg-green-100/70",
            shouldHighlight && "bg-green-100/70"
          )}
        >
          <div className="relative h-full">
            <div className="text-right">
              {dayNumber && (
                <strong className={clsx(!isCurrentMonth ? "text-gray-300" : "")}>{dayNumber}</strong>
              )}
            </div>

            <DayEventsList calendar={calendar} date={date} events={events} locale={locale} />
          </div>
        </td>
      </Modal.Open>
      <Modal.Window name={key.toString()}>
        <AddEventForm fromDate={date || ""} toDate={date || ""} onAdd={onAddEvent} />
      </Modal.Window>
    </React.Fragment>
  );
};
export default CalendarCell;
