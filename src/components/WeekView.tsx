import clsx from "clsx";
import Modal from "./modal/Modal";
import React, { useMemo } from "react";
import AddEventForm from "./AddEventForm";
import DateObject from "react-date-object";
import { useWeekView } from "../hooks/useWeekView";
import { useGetCalendar } from "../hooks/useGetCalendar";
import WeekEvent from "./weekView/WeekEvent";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import { calculateAllDayEventLayout } from "../utils/weekEventLayout";

const MAX_VISIBLE_EVENTS = 2;

const WeekView = () => {
  const eventStore = useEventStore();
  const { calendar } = useGetCalendar();
  const { weekDays, timeSlots, hours, handleAddEvent, allDayEvents, timedEvents } = useWeekView();

  const updateEvent = (event: CalendarEvent) => {
    eventStore.updateEvent(event);
  };

  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
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
            <div className="grid grid-cols-[auto_1fr] border-t border-gray-200">
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
                  <React.Fragment key={day.toUnix()}>
                    <Modal.Open opens={day.toString()} stopClickPropagation={true}>
                      <div key={day.toUnix()} className="border-l border-gray-200 p-1 h-full" />
                    </Modal.Open>
                    <Modal.Window name={day.toString()}>
                      <AddEventForm
                        onAdd={handleAddEvent}
                        initialEvent={{
                          allDay: true,
                          start: day.format("YYYY/MM/DD - HH:mm"),
                          end: new DateObject(day.set({ hour: 23, minute: 59, second: 59 })),
                        }}
                      />
                    </Modal.Window>
                  </React.Fragment>
                ))}
                {layoutEvents
                  .filter((event) => event.rowIndex < MAX_VISIBLE_EVENTS)
                  .map((event) => (
                    <React.Fragment key={event.id}>
                      <Modal.Open opens={event.id} stopClickPropagation={true}>
                        <div
                          style={{
                            gridColumn: `${event.startDayIndex + 1} / span ${event.span}`,
                            top: `${event.rowIndex * 28}px`, // استفاده از rowIndex
                            backgroundColor: `${event.color}20`,
                            borderColor: event.color,
                          }}
                          className="absolute w-full my-1 p-1 text-xs truncate rounded border-l-4 cursor-grab active:cursor-grabbing select-none"
                        >
                          <p className="font-semibold" style={{ color: event.color }}>
                            {event.title}
                          </p>
                        </div>
                      </Modal.Open>
                      <Modal.Window name={event.id}>
                        <AddEventForm
                          toDate={event.end}
                          onAdd={updateEvent}
                          initialEvent={event}
                          fromDate={event.start}
                          onDelete={deleteEvent}
                        />
                      </Modal.Window>
                    </React.Fragment>
                  ))}

                {dailyEventCounts.map((count, dayIndex) => {
                  if (count > MAX_VISIBLE_EVENTS) {
                    const day = weekDays[dayIndex];
                    const modalName = `more-${day.toUnix()}`; // یک نام منحصر به فرد برای مودال هر روز

                    // رویدادهای مربوط به این روز را برای نمایش در مودال فیلتر می‌کنیم
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
                                <li
                                  key={event.id}
                                  className="mb-2 p-2 rounded"
                                  style={{ backgroundColor: `${event.color}20` }}
                                >
                                  <p className="font-semibold" style={{ color: event.color }}>
                                    {event.title}
                                  </p>
                                </li>
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
                  return (
                    <div key={day.toUnix()} className="relative grid grid-rows-48 border-l border-gray-200">
                      {timedEventsForDay.map((event) => (
                        <WeekEvent day={day} key={event.id} event={event} />
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
