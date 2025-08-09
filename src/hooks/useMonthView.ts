import { useCalendarStore } from "../store/calendarStore";
import { useEventStore } from "../store/eventStore";
import { useGenerateCalendarCells } from "./useCalendarCells";
import { daysOfWeekEn, daysOfWeekFa } from "../constants";
import { useMemo } from "react";
import type { CalendarEvent } from "../types/globalTypes";
import DateObject from "react-date-object";
import { processEventsForLayout } from "../utils/eventLayout";
import { useGetCalendar } from "./useGetCalendar";

export const useMonthView = () => {
  const eventStore = useEventStore();
  const { calendarType } = useCalendarStore();
  const { calendar, locale } = useGetCalendar();
  const generatedDate = useGenerateCalendarCells();
  const daysOfWeek = calendarType === "persian" ? daysOfWeekFa : daysOfWeekEn;

  const rows = useMemo(
    () => Array.from({ length: 6 }, (_, rowIndex) => generatedDate.slice(rowIndex * 7, rowIndex * 7 + 7)),
    [generatedDate]
  );

  const addEvent = (event: CalendarEvent) => {
    eventStore.addEvent(event);
  };

  const handleEventDrop = (eventId: string, newDate: DateObject) => {
    const eventToMove = eventStore.events.find((event) => event.id === eventId);
    if (!eventToMove) return;

    const originalStart = new DateObject(eventToMove.start);
    const duration = new DateObject(eventToMove.end).toUnix() - originalStart.toUnix();

    const newStartDate = new DateObject({ date: newDate, calendar, locale })
      .set("hour", originalStart.hour)
      .set("minute", originalStart.minute)
      .set("second", originalStart.second);

    console.log("before add second START DATE", newStartDate);
    const newEndDate = new DateObject(newStartDate).add(duration, "second");
    console.log("after add second END DATE", newEndDate);

    eventStore.updateEvent({
      ...eventToMove,
      start: newStartDate.toDate().toISOString(),
      end: newEndDate.toDate().toISOString(),
    });
  };

  const eventLayout = useMemo(
    () => processEventsForLayout(locale, eventStore.events, generatedDate, calendar),
    [generatedDate, eventStore.events, calendar, locale]
  );

  console.log("events", eventStore.events);

  return {
    rows,
    locale,
    calendar,
    addEvent,
    daysOfWeek,
    eventLayout,
    handleEventDrop,
  };
};
