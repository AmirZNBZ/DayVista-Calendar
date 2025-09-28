import clsx from "clsx";
import { useMemo } from "react";
import DateObject from "react-date-object";
import { useGetCalendar } from "../../hooks/useGetCalendar";
import type { CalendarEvent } from "../../types/globalTypes";
import AllDayCell from "../weekView/AllDayCell";
import AllDayWeekEvent from "../weekView/AllDayWeekEvent";
import { getDayBoundary } from "../../helpers/getDayBoundary";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";

interface DayViewHeaderProps {
  day: DateObject;
  allDayEvents: CalendarEvent[];
  handleAllDayEventDrop: (eventId: string, newDay: DateObject) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

const DayViewHeader = ({
  day,
  allDayEvents,
  handleAllDayEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
}: DayViewHeaderProps) => {
  const { calendar } = useGetCalendar();

  const titleFormatted = useMemo(() => {
    return calendar.name === "gregorian"
      ? day.format("DD/MMM/YYYY")
      : day.format("DD/MMMM/YYYY");
  }, [day, calendar.name]);

  // Filter all-day events overlapping this day
  const dayStartUnix = getDayBoundary(day, "start").toUnix();
  const dayEndUnix = getDayBoundary(day, "end").toUnix();

  const layoutEvents = useMemo(() => {
    const events = allDayEvents
      .filter((e) => {
        const s = new DateObject(e.start).toUnix();
        const en = new DateObject(e.end).toUnix();
        return s < dayEndUnix && en > dayStartUnix;
      })
      .sort(
        (a, b) =>
          new DateObject(a.start).toUnix() - new DateObject(b.start).toUnix()
      )
      // adapt to AllDayWeekEvent expected shape
      .map((e, idx) => ({
        ...e,
        startDayIndex: 0,
        span: 1,
        rowIndex: idx,
      }));
    return events;
  }, [allDayEvents, dayStartUnix, dayEndUnix]);

  const MAX_VISIBLE = 3;

  return (
    <header className="flex flex-none flex-col shadow z-10">
      <div className="max-w-[1247px] w-full overflow-hidden">
        {/* Day Label */}
        <div className="grid grid-cols-[auto_1fr]">
          <div className={clsx(`w-16 border-r border-gray-200`)}></div>
          <div className="p-3">
            <h2 className="text-2xl font-medium">{titleFormatted}</h2>
          </div>
        </div>

        {/* All-day row */}
        <div className="grid grid-cols-[auto_1fr] border-t border-gray-200 min-h-20">
          <div
            className={`w-16 flex items-start justify-center pt-2 border-r border-gray-200`}
          >
            <span className="text-xs font-medium text-gray-500">all-day</span>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 min-h-[34px] relative">
              {/* Drop/Add target */}
              <AllDayCell
                day={day}
                onEventDrop={handleAllDayEventDrop}
                onAddEvent={handleAddEvent}
              />

              {/* Render events */}
              {layoutEvents.slice(0, MAX_VISIBLE).map((ev) => (
                <AllDayWeekEvent key={ev.id} event={ev as any} />
              ))}

              {/* +N more indicator */}
              {layoutEvents.length > MAX_VISIBLE && (
                <>
                  <Modal.Open
                    opens={`day-header-more-${day.toUnix()}`}
                    stopClickPropagation
                  >
                    <div className="absolute right-2 top-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded cursor-pointer">
                      +{layoutEvents.length - MAX_VISIBLE} more
                    </div>
                  </Modal.Open>
                  <Modal.Window name={`day-header-more-${day.toUnix()}`}>
                    <div className="p-4 bg-white rounded-lg w-96">
                      <h3 className="text-lg font-bold mb-3">
                        {day.format("DD MMMM")} — All‑day events
                      </h3>
                      <ul className="max-h-80 overflow-y-auto">
                        {layoutEvents.map((event) => (
                          <Modal key={event.id}>
                            <Modal.Open
                              opens={`header-open-event-modal-${event.id}`}
                              stopClickPropagation
                            >
                              <li
                                className="mb-2 p-2 rounded flex items-center cursor-pointer"
                                style={{ backgroundColor: `${event.color}20` }}
                              >
                                <div
                                  className="w-2 h-2 rounded-full mr-3"
                                  style={{ backgroundColor: event.color }}
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {event.title}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {new DateObject(event.start).format(
                                      "HH:mm"
                                    )}
                                    –{new DateObject(event.end).format("HH:mm")}
                                  </p>
                                </div>
                              </li>
                            </Modal.Open>
                            <Modal.Window
                              name={`header-open-event-modal-${event.id}`}
                            >
                              {/* <EditEvent event={undefined}/> */}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DayViewHeader;
