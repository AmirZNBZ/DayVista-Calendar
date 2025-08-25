import React from "react";
import DateObject from "react-date-object";
import type { CalendarEvent } from "../../types/globalTypes";
import AddEventForm from "../AddEventForm";
import Modal from "../modal/Modal";
import AllDayCell from "./AllDayCell";
import AllDayWeekEvent from "./AllDayWeekEvent";

const MAX_VISIBLE_EVENTS = 2;

export interface AllDayLayoutEvent extends CalendarEvent {
  startDayIndex: number;
  span: number;
  rowIndex: number;
}

interface AllDaySectionProps {
  weekDays: DateObject[];
  allDayEvents: CalendarEvent[];
  layoutEvents: AllDayLayoutEvent[];
  dailyEventCounts: number[];
  maxRows: number;
  handleAllDayEventDrop: (eventId: string, newDay: DateObject) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

const AllDaySection = ({
  weekDays,
  allDayEvents,
  layoutEvents,
  dailyEventCounts,
  maxRows,
  handleAllDayEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
}: AllDaySectionProps) => {
  return (
    <div
      className="grid grid-cols-7 min-h-[34px] relative"
      style={{ minHeight: `${Math.min(maxRows, MAX_VISIBLE_EVENTS + 1) * 28 + 10}px` }}
    >
      {weekDays.map((day) => (
        <AllDayCell
          key={day.toUnix()}
          day={day}
          onEventDrop={handleAllDayEventDrop}
          onAddEvent={handleAddEvent}
        />
      ))}
      {layoutEvents
        .filter((event) => event.rowIndex < MAX_VISIBLE_EVENTS)
        .map((event) => (
          <AllDayWeekEvent key={event.id} event={event} />
        ))}

      {dailyEventCounts.map((count, dayIndex) => {
        if (count > MAX_VISIBLE_EVENTS) {
          const day = weekDays[dayIndex];
          const modalName = `more-allday-${day.toUnix()}`;

          const eventsForThisModal = allDayEvents.filter((event) => {
            const eventStartUnix = new DateObject(event.start)
              .set({ hour: 0, minute: 0, second: 0 })
              .toUnix();
            const eventEndUnix = new DateObject(event.end).set({ hour: 23, minute: 59, second: 59 }).toUnix();
            return (
              day.set({ hour: 0, minute: 0, second: 0 }).toUnix() >= eventStartUnix &&
              day.set({ hour: 0, minute: 0, second: 0 }).toUnix() <= eventEndUnix
            );
          });

          return (
            <React.Fragment key={`more-frag-${dayIndex}`}>
              <Modal.Open opens={modalName} stopClickPropagation={true}>
                <div
                  className="absolute text-xs font-semibold text-gray-600 hover:underline cursor-pointer px-2 py-1"
                  style={{
                    gridColumn: `${dayIndex + 1} / span 1`,
                    top: `${MAX_VISIBLE_EVENTS * 28}px`,
                  }}
                >
                  +{count - MAX_VISIBLE_EVENTS} more
                </div>
              </Modal.Open>
              <Modal.Window name={modalName}>
                <div className="p-4 bg-white rounded-lg w-80">
                  <h3 className="text-lg font-bold mb-3">All-day Events for {day.format("DD MMMM")}</h3>
                  <ul className="max-h-60 overflow-y-auto">
                    {eventsForThisModal.map((event) => (
                      <Modal key={event.id}>
                        <Modal.Open opens={`all-daily-event-more-${event.id}`} stopClickPropagation>
                          <li
                            className="mb-2 p-2 rounded cursor-pointer"
                            style={{ backgroundColor: `${event.color}20` }}
                          >
                            <p className="font-semibold" style={{ color: event.color }}>
                              {event.title}
                            </p>
                          </li>
                        </Modal.Open>
                        <Modal.Window name={`all-daily-event-more-${event.id}`}>
                          <AddEventForm
                            toDate={event.end}
                            onAdd={handleUpdateEvent}
                            initialEvent={event}
                            fromDate={event.start}
                            onDelete={handleDeleteEvent}
                          />
                        </Modal.Window>
                      </Modal>
                    ))}
                  </ul>
                </div>
              </Modal.Window>
            </React.Fragment>
          );
        }
        return null;
      })}
    </div>
  );
};

export default AllDaySection;
