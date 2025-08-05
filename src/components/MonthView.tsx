import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import { daysOfWeekEn, daysOfWeekFa } from "../constants";
import { useGenerateCalendarCells } from "../hooks/useCalendarCells";
import { useCalendarStore } from "../store/calendarStore";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import CalendarCell from "./CalendarCell";
import Modal from "./modal/Modal";
import { useMemo } from "react";
import { processEventsForLayout } from "../utils/eventLayout";

const MonthView = () => {
  const eventStore = useEventStore();
  const { calendarType } = useCalendarStore();
  const generatedDate = useGenerateCalendarCells();

  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    generatedDate.slice(rowIndex * 7, rowIndex * 7 + 7)
  );

  const addEvent = (event: CalendarEvent) => {
    eventStore.addEvent(event);
  };

  const calendar = calendarType === "persian" ? persian : gregorian;
  const locale = calendarType === "persian" ? persian_fa : gregorian_en;

  const daysOfWeek = calendarType === "persian" ? daysOfWeekFa : daysOfWeekEn;

  const handleEventDrop = (eventId: string, newDate: string) => {
    const eventToMove = eventStore.events.find((ev) => ev.id === eventId);
    if (!eventToMove) return;

    const originalStart = new DateObject(eventToMove.start);

    const newStartDate = new DateObject({ date: newDate, calendar, locale })
      .set("hour", originalStart.hour)
      .set("minute", originalStart.minute)
      .set("second", originalStart.second);

    const duration = new DateObject(eventToMove.end).toUnix() - originalStart.toUnix();
    const newEndDate = new DateObject(newStartDate).add(duration, "second");

    eventStore.updateEvent({
      ...eventToMove,
      start: newStartDate.toDate().toISOString(),
      end: newEndDate.toDate().toISOString(),
    });
  };

  const eventLayout = useMemo(
    () => processEventsForLayout(locale, eventStore.events, generatedDate, calendar),
    [eventStore.events, generatedDate, calendar, locale]
  );

  console.log("rows", rows);
  console.log("events", eventStore.events);

  return (
    <>
      <Modal>
        <table className="w-full h-full table-fixed">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th key={day} className="p-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((week, rowIdx) => (
              <tr key={rowIdx}>
                {week.map((cell) => {
                  const eventsForThisDay = eventLayout.get(cell.date) || [];

                  return (
                    <CalendarCell
                      key={cell.key}
                      locale={locale}
                      cellData={cell}
                      calendar={calendar}
                      onAddEvent={addEvent}
                      events={eventsForThisDay}
                      onEventDrop={handleEventDrop}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

export default MonthView;
