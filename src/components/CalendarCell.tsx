import clsx from "clsx";
import React, { useMemo } from "react";
import DateObject, { type Calendar, type Locale } from "react-date-object";
import { useDrop } from "react-dnd";
import type { CalendarEvent, EventSegment } from "../types/globalTypes";
import AddEventForm from "./AddEventForm";
import Modal from "./modal/Modal";
import EditEvent from "./month-view/EditEvent";
import { useEventStore } from "../store/eventStore";

interface CalendarCellProps {
  cellData: {
    key: number | string;
    dayNumber: number;
    isCurrentMonth: boolean;
    date: string;
  };
  events: EventSegment[];
  onEventDrop: (eventId: string, newDate: string) => void;
  onAddEvent: (event: CalendarEvent) => void;
  calendar: Omit<Calendar, "leapsLength">;
  locale: Locale;
}
const MAX_EVENTS_VISIBLE = 3;

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

  const sortedEvents = [...events].sort((a, b) => a.level - b.level);

  const eventsInView = sortedEvents.filter((segment) => segment.level < MAX_EVENTS_VISIBLE);

  const visibleEvents = eventsInView.slice(0, MAX_EVENTS_VISIBLE - 1);
  const remainingCount = sortedEvents.length - eventsInView.length;
  const hasMoreLink = sortedEvents.length > MAX_EVENTS_VISIBLE;

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
            <div onClick={(e) => e.stopPropagation()} className="mt-1 space-y-1 text-xs text-left">
              {(hasMoreLink ? visibleEvents : eventsInView).map((segment) => (
                <EditEvent
                  key={`${segment.id}-${date}`}
                  event={segment}
                  isStart={segment.isStart}
                  isEnd={segment.isEnd}
                  topPosition={segment.level * 24}
                />
              ))}
              {hasMoreLink && (
                <Modal.Open stopClickPropagation={true} opens={`more-events-${date}`}>
                  <p className="absolute bottom-0 text-xs font-bold text-gray-600 hover:underline cursor-pointer">
                    +{sortedEvents.length - (MAX_EVENTS_VISIBLE - 1)} more
                  </p>
                </Modal.Open>
              )}
            </div>
          </div>
        </td>
      </Modal.Open>
      <Modal.Window name={key.toString()}>
        <AddEventForm fromDate={date || ""} toDate={date || ""} onAdd={onAddEvent} />
      </Modal.Window>
      {remainingCount > 0 && (
        <Modal.Window name={`more-events-${date}`}>
          <Modal>
            <div className="p-4">
              <h3 className="font-bold mb-4">
                رویدادهای روز {new DateObject({ date, calendar, locale }).format("DD MMMM YYYY")}
              </h3>
              <ul className="space-y-2">
                {sortedEvents.map((ev) => {
                  const isMultiDay =
                    new DateObject(ev.start).format("YYYY-MM-DD") !==
                    new DateObject(ev.end).format("YYYY-MM-DD");

                  return <EditEvent event={ev} key={ev.id} viewMode="list" isMultiDay={isMultiDay} />;
                })}
              </ul>
            </div>
          </Modal>
        </Modal.Window>
      )}
    </React.Fragment>
  );
};
export default CalendarCell;
