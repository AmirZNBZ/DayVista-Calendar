import clsx from "clsx";
import Modal from "./modal/Modal";
import React from "react";
import AddEventForm from "./AddEventForm";
import DateObject from "react-date-object";
import { useWeekView } from "../hooks/useWeekView";
import { useGetCalendar } from "../hooks/useGetCalendar";
import WeekEvent from "./weekView/WeekEvent";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";

const WeekView = () => {
  const eventStore = useEventStore();
  const { calendar, locale } = useGetCalendar();
  const { weekDays, timeSlots, hours, handleAddEvent, allDayEvents, timedEvents } = useWeekView();

  const updateEvent = (event: CalendarEvent) => {
    eventStore.updateEvent(event);
  };

  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
  };

  console.log(calendar);

  //عرض ستون تایم لاین که باید در همه جا یکسان باشد
  const timelineColumnWidth = "w-16";

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
              <div className="grid grid-cols-7 min-h-[34px] relative">
                {weekDays.map((day) => (
                  <React.Fragment key={day.toUnix()}>
                    <Modal.Open opens={day.toString()} stopClickPropagation={true}>
                      <div className="border-l border-gray-200 p-1 h-full" />
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

                <div className="absolute inset-x-0 grid grid-cols-7">
                  {allDayEvents.map((event, index) => {
                    const eventStart = new DateObject({ date: event.start, calendar, locale });
                    const eventEnd = new DateObject({ date: event.end, calendar, locale });

                    // ۲. محاسبه ستون شروع رویداد در این هفته
                    let startDayIndex = weekDays.findIndex(
                      (day) => day.format("YYYYMMDD") === eventStart.format("YYYYMMDD")
                    );
                    if (startDayIndex === -1 && eventStart.toUnix() < weekDays[0].toUnix()) {
                      startDayIndex = 0;
                    }

                    // ۳. محاسبه ستون پایان رویداد در این هفته
                    let endDayIndex = weekDays.findIndex(
                      (day) => day.format("YYYYMMDD") === eventEnd.format("YYYYMMDD")
                    );
                    if (endDayIndex === -1 && eventEnd.toUnix() > weekDays[6].toUnix()) {
                      endDayIndex = 6;
                    }

                    if (startDayIndex === -1 || endDayIndex === -1 || startDayIndex > endDayIndex)
                      return null;

                    // ۴. محاسبه تعداد ستون‌هایی که باید اشغال شود
                    const span = endDayIndex - startDayIndex + 1;

                    return (
                      <React.Fragment key={event.id}>
                        <Modal.Open opens={event.id} stopClickPropagation={true}>
                          <div
                            // ۵. اعمال استایل برای قرارگیری و طول رویداد
                            style={{
                              gridColumn: `${startDayIndex + 1} / span ${span}`,
                              top: `${index * 28}px`, // فاصله عمودی برای جلوگیری از روی هم افتادن
                              backgroundColor: `${event.color}20`,
                              borderColor: event.color,
                            }}
                            className="absolute w-full my-1 p-1 text-xs truncate rounded border-l-4 cursor-grab active:cursor-grabbing"
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
                    );
                  })}
                </div>

                {/* {weekDays.map((day) => {
                  const dayStartUnix = new DateObject(day).set({ hour: 0, minute: 0, second: 0 }).toUnix();
                  const dayEndUnix = new DateObject(day).set({ hour: 23, minute: 59, second: 59 }).toUnix();

                  const eventsForDay = allDayEvents.filter((event) => {
                    const eventStartUnix = new DateObject({ date: event.start }).toUnix();
                    const eventEndUnix = new DateObject({ date: event.end }).toUnix();
                    return eventStartUnix < dayEndUnix && eventEndUnix > dayStartUnix;
                  });

                  return (
                    <React.Fragment key={day.toUnix()}>
                      <Modal.Open opens={day.toString()} stopClickPropagation={true}>
                        <div className="relative border-l border-gray-200 p-1">
                          {eventsForDay.map((event) => (
                            <React.Fragment key={event.id}>
                              <Modal.Open opens={event.id} stopClickPropagation={true}>
                                <div
                                  key={event.id}
                                  style={{ backgroundColor: `${event.color}20`, borderColor: event.color }}
                                  className="rounded p-1 m-1 text-xs truncate border-l-2 cursor-grab active:cursor-grabbing"
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
                        </div>
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
                  );
                })} */}
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
                      {/* for centering the hour of columns */}
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
                {/* {weekDays.map((day) => (
                  <div key={day.toUnix()} className="relative grid grid-rows-48 border-l border-gray-200">
                    {timedEvents
                      .filter(
                        (event) =>
                          new DateObject({ date: event.start, calendar, locale }).format("YYYY MM DD") ===
                          day.format("YYYY MM DD")
                      )
                      .map((event) => (
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
                            <AddEventForm onAdd={handleAddEvent} toDate={toDateObj} fromDate={fromDateObj} />
                          </Modal.Window>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Modal>
  );
};

export default WeekView;
