import React, { useMemo } from "react";
import DateObject from "react-date-object";
import { calculateTimedEventLayout } from "../../utils/weekEventLayout";
import type { CalendarEvent } from "../../types/globalTypes";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";
import WeekEvent from "./WeekEvent";
import TimeSlot from "./TimeSlot";
import { getDayBoundary } from "../../helpers/getDayBoundary";

interface DayColumnProps {
  day: DateObject;
  timedEvents: CalendarEvent[];
  timeSlots: number[];
  handleTimedEventDrop: (eventId: string, newStartDate: DateObject) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

const DayColumn = ({
  day,
  timedEvents,
  timeSlots,
  handleTimedEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
}: DayColumnProps) => {
  // ۱. رویدادهای مربوط به این روز خاص را فیلتر می‌کنیم
  const timedEventsForDay = useMemo(() => {
    const dayStartUnix = getDayBoundary(day, "start").toUnix();
    const dayEndUnix = getDayBoundary(day, "end").toUnix();
    return timedEvents.filter((event) => {
      const eventStartUnix = new DateObject(event.start).toUnix();
      const eventEndUnix = new DateObject(event.end).toUnix();
      return eventStartUnix < dayEndUnix && eventEndUnix > dayStartUnix;
    });
  }, [day, timedEvents]);

  const { layoutTimedEvents, moreIndicators } = useMemo(
    () => calculateTimedEventLayout(timedEventsForDay, day),
    [timedEventsForDay, day]
  );

  return (
    <div key={day.toUnix()} className="relative grid grid-rows-48 border-l border-gray-200">
      {layoutTimedEvents.map((event) => (
        <WeekEvent key={event.id} event={event} />
      ))}

      {moreIndicators.map((indicator) => (
        <React.Fragment key={indicator.id}>
          <Modal.Open opens={indicator.id} stopClickPropagation={true}>
            <div
              className="absolute p-1.5 rounded-md text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center z-10"
              style={{
                top: `${indicator.top}px`,
                height: `${indicator.height}px`,
                left: indicator.left,
                width: indicator.width,
              }}
            >
              <p className="font-semibold text-gray-700">+{indicator.count} more</p>
            </div>
          </Modal.Open>
          <Modal.Window name={indicator.id}>
            <div className="p-4 bg-white rounded-lg w-96">
              <h3 className="text-lg font-bold mb-3">Events for {day.format("DD MMMM")}</h3>
              <ul className="max-h-80 overflow-y-auto">
                {indicator.events.map((event: CalendarEvent) => (
                  <Modal key={event.id}>
                    <Modal.Open opens={`more-open-event-modal-${event.id}`} stopClickPropagation>
                      <li
                        className="mb-2 p-2 rounded flex items-center cursor-pointer"
                        style={{ backgroundColor: `${event.color}20` }}
                      >
                        <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: event.color }} />
                        <div>
                          <p className="font-semibold" style={{ color: event.color }}>
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new DateObject(event.start).format("hh:mm A")} -{" "}
                            {new DateObject(event.end).format("hh:mm A")}
                          </p>
                        </div>
                      </li>
                    </Modal.Open>
                    <Modal.Window name={`more-open-event-modal-${event.id}`}>
                      <AddEventForm
                        toDate={event.end}
                        initialEvent={event}
                        fromDate={event.start}
                        onAdd={handleUpdateEvent}
                        onDelete={handleDeleteEvent}
                      />
                    </Modal.Window>
                  </Modal>
                ))}
              </ul>
            </div>
          </Modal.Window>
        </React.Fragment>
      ))}

      {timeSlots.map((slotIndex) => {
        const fromDateObj = new DateObject(day).set({
          hour: Math.floor(slotIndex / 2),
          minute: (slotIndex % 2) * 30,
          second: 0,
        });
        const toDateObj = new DateObject(fromDateObj).add(30, "minutes");
        const modalId = `${day.toUnix()}-${slotIndex}`;
        return (
          <React.Fragment key={modalId}>
            <TimeSlot day={day} slotIndex={slotIndex} onEventDrop={handleTimedEventDrop}>
              <Modal.Open stopClickPropagation opens={modalId}>
                <div className="h-full w-full hover:bg-amber-500/10 cursor-pointer" />
              </Modal.Open>
            </TimeSlot>
            <Modal.Window name={modalId}>
              <AddEventForm onAdd={handleAddEvent} toDate={toDateObj} fromDate={fromDateObj} />
            </Modal.Window>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DayColumn;
