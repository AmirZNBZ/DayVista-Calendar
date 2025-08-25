import clsx from "clsx";
import React, { useMemo } from "react";
import DateObject from "react-date-object";
import { useGetCalendar } from "../hooks/useGetCalendar";
import { useWeekView } from "../hooks/useWeekView";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import { calculateAllDayEventLayout, calculateTimedEventLayout } from "../utils/weekEventLayout";
import AddEventForm from "./AddEventForm";
import Modal from "./modal/Modal";
import AllDayCell from "./weekView/AllDayCell";
import AllDayWeekEvent from "./weekView/AllDayWeekEvent";
import TimeSlot from "./weekView/TimeSlot";
import WeekEvent from "./weekView/WeekEvent";

const MAX_VISIBLE_EVENTS = 2;

const WeekView = () => {
  const { events: allEvents, updateEvent, deleteEvent } = useEventStore();

  const { calendar } = useGetCalendar();
  const { weekDays, timeSlots, hours, handleAddEvent, allDayEvents, timedEvents } = useWeekView();

  const handleUpdateEvent = (event: CalendarEvent) => {
    updateEvent(event);
  };

  const handleDeleteEvent = (id: CalendarEvent["id"]) => {
    deleteEvent(id);
  };

  const handleTimedEventDrop = (eventId: string, newStartDate: DateObject) => {
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) return;

    const start = new DateObject(event.start);
    const end = new DateObject(event.end);
    const duration = end.toUnix() - start.toUnix();

    const newEndDate = new DateObject(newStartDate).add(duration, "seconds");

    updateEvent({
      ...event,
      start: newStartDate,
      end: newEndDate,
    });
  };

  const handleAllDayEventDrop = (eventId: string, newDay: DateObject) => {
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) return;

    const originalStart = new DateObject(event.start);
    const end = new DateObject(event.end);
    const duration = end.toUnix() - originalStart.toUnix();

    const newStartDate = new DateObject(newDay).set({
      hour: originalStart.hour,
      minute: originalStart.minute,
      second: originalStart.second,
    });

    const newEndDate = new DateObject(newStartDate).add(duration, "seconds");

    updateEvent({
      ...event,
      start: newStartDate,
      end: newEndDate,
      allDay: true,
    });
  };

  console.log(calendar);

  const timelineColumnWidth = "w-16";

  const { layoutEvents, dailyEventCounts, maxRows } = useMemo(
    () => calculateAllDayEventLayout(allDayEvents, weekDays),
    [allDayEvents, weekDays]
  );

  return (
    <Modal>
      <div className="flex flex-col h-[85vh] bg-white text-gray-700">
        <header className="flex flex-none flex-col shadow z-10">
          <div className="max-w-[1247px] w-full overflow-hidden">
            <div className="grid grid-cols-[auto_1fr]">
              <div className={clsx(`${timelineColumnWidth} border-r border-gray-200`)}></div>
              <div className="grid grid-cols-7">
                {weekDays.map((day) => (
                  <div key={day.toUnix()} className="flex-1 p-2 text-center border-l border-gray-200">
                    <p className="text-2xl font-medium">
                      {calendar.name === "gregorian" ? day.format("DD/MMM") : day.format("DD/MMMM")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] border-t border-gray-200 min-h-20">
              <div
                className={`${timelineColumnWidth} flex items-start justify-center pt-2 border-r border-gray-200`}
              >
                <span className="text-xs font-medium text-gray-500">all-day</span>
              </div>
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
                    const modalName = `more-${day.toUnix()}`;

                    const eventsForThisModal = allDayEvents.filter((event) => {
                      const eventStartUnix = new DateObject(event.start)
                        .set({ hour: 0, minute: 0, second: 0 })
                        .toUnix();
                      const eventEndUnix = new DateObject(event.end)
                        .set({ hour: 23, minute: 59, second: 59 })
                        .toUnix();
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
                            <h3 className="text-lg font-bold mb-3">رویدادهای {day.format("DD MMMM")}</h3>
                            <ul className="max-h-60 overflow-y-auto">
                              {eventsForThisModal.map((event) => (
                                <Modal>
                                  <Modal.Open
                                    stopClickPropagation={true}
                                    opens={`all-daily-event-more-${event.id}`}
                                  >
                                    <li
                                      key={event.id}
                                      className="mb-2 p-2 rounded"
                                      style={{ backgroundColor: `${event.color}20` }}
                                    >
                                      <p className="font-semibold" style={{ color: event.color }}>
                                        {event.title}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {new DateObject(event.start).format("hh:mm A")} -{" "}
                                        {new DateObject(event.end).format("hh:mm A")}
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
            </div>
          </div>
        </header>

        <main className="flex-auto overflow-auto">
          <div className="max-w-[1247px] w-full overflow-hidden">
            <div className="relative grid grid-cols-[auto_1fr]">
              <div className={`${timelineColumnWidth} grid grid-rows-24`}>
                {hours.map((hour) => (
                  <div key={hour} className="h-16 relative flex justify-end pr-2">
                    <div className="flex flex-col text-xs text-gray-500">
                      <span className="flex-1 place-content-center">
                        {hour === 0
                          ? "12 AM"
                          : hour < 12
                            ? `${hour} AM`
                            : hour === 12
                              ? "12 PM"
                              : `${hour - 12} PM`}
                      </span>
                      <span className="flex-1"></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {weekDays.map((day) => {
                  const dayStartUnix = new DateObject(day).set({ hour: 0, minute: 0, second: 0 }).toUnix();
                  const dayEndUnix = new DateObject(day).set({ hour: 23, minute: 59, second: 59 }).toUnix();

                  const timedEventsForDay = timedEvents.filter((event) => {
                    const eventStartUnix = new DateObject({ date: event.start }).toUnix();
                    const eventEndUnix = new DateObject({ date: event.end }).toUnix();
                    return eventStartUnix < dayEndUnix && eventEndUnix > dayStartUnix;
                  });

                  const { layoutTimedEvents, moreIndicators } = calculateTimedEventLayout(
                    timedEventsForDay,
                    day
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
                                    <Modal.Open
                                      stopClickPropagation={true}
                                      opens={`more-open-event-modal-${event.id}`}
                                    >
                                      <li
                                        key={event.id}
                                        className="mb-2 p-2 rounded flex items-center pointer"
                                        style={{ backgroundColor: `${event.color}20` }}
                                      >
                                        <div
                                          className="w-2 h-2 rounded-full mr-3"
                                          style={{ backgroundColor: event.color }}
                                        ></div>
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
                      ))}
                      {timeSlots.map((slotIndex) => {
                        const hour = Math.floor(slotIndex / 2);
                        const minute = (slotIndex % 2) * 30;
                        const fromDateObj = new DateObject(day).set({ hour, minute, second: 0 });
                        const toDateObj = new DateObject(fromDateObj).add(30, "minutes");
                        const isHalfHour = slotIndex % 2 !== 0;
                        const modalId = `${day.toUnix()}-${slotIndex}`;
                        return (
                          <React.Fragment key={modalId}>
                            <TimeSlot day={day} slotIndex={slotIndex} onEventDrop={handleTimedEventDrop}>
                              <Modal.Open stopClickPropagation opens={modalId}>
                                <div
                                  className={clsx(
                                    "h-8 hover:bg-amber-500/10 cursor-pointer group",
                                    !isHalfHour && "border-t border-gray-200"
                                  )}
                                >
                                  {isHalfHour && <div className="border-t border-dashed border-gray-300" />}
                                </div>
                              </Modal.Open>
                            </TimeSlot>
                            <Modal.Window name={modalId}>
                              <AddEventForm
                                onAdd={handleAddEvent}
                                toDate={toDateObj}
                                fromDate={fromDateObj}
                              />
                            </Modal.Window>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Modal>
  );
};

export default WeekView;
