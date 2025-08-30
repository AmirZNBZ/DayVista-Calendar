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
    date: DateObject;
    dayNumber: number;
    key: number | string;
    isCurrentMonth: boolean;
  };
  locale: Locale;
  events: EventSegment[];
  calendar: Omit<Calendar, "leapsLength">;
  onAddEvent: (event: CalendarEvent) => void;
  onEventDrop: (eventId: string, newDate: DateObject) => void;
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
      <td
        data-no-outside-click
        ref={dropRef as unknown as React.Ref<HTMLTableCellElement>}
        className={clsx(
          "active:bg-purple-200/20 select-none min-h-28 h-28 p-1 align-top border border-orange-400",
          isOver && "bg-green-100/70",
          shouldHighlight && "bg-green-100/70"
        )}
      >
        <Modal.Open opens={key.toString()} key={key}>
          <div className="relative h-full pointer">
            <div className="text-right">
              {dayNumber && (
                <strong className={clsx(!isCurrentMonth ? "text-gray-300" : "")}>{dayNumber}</strong>
              )}
            </div>

            <DayEventsList calendar={calendar} date={date} events={events} locale={locale} />
          </div>
        </Modal.Open>
      </td>
      <Modal.Window name={key.toString()}>
        <AddEventForm fromDate={date} toDate={date} onAdd={onAddEvent} />
      </Modal.Window>
    </React.Fragment>
  );
};
export default CalendarCell;
