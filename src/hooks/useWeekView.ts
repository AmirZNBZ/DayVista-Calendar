import { useMemo } from "react";
import DateObject from "react-date-object";
import { useEventStore } from "../store/eventStore";
import { useCalendarStore } from "../store/calendarStore";
import type { CalendarEvent } from "../types/globalTypes";

export const useWeekView = () => {
  const { addEvent, events } = useEventStore();
  const viewDate = useCalendarStore((state) => state.viewDate);

  // آرایه‌ای از ۴۸ اسلات ۳۰ دقیقه‌ای
  const timeSlots = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  // آرایه‌ای از 24 ساعت
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const weekDays = useMemo(() => {
    const startOfWeek = viewDate.toFirstOfWeek();
    const days: DateObject[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new DateObject(startOfWeek).add(i, "day"));
    }
    return days;
  }, [viewDate]);

  const { timedEvents, allDayEvents } = useMemo(() => {
    if (!weekDays.length) return { timedEvents: [], allDayEvents: [] };

    const weekStartUnix = new DateObject(weekDays[0]).set({ hour: 0o0, minute: 0o0, second: 0o0 }).toUnix();
    const weekEndUnix = new DateObject(weekDays[6]).set({ hour: 23, minute: 59, second: 59 }).toUnix();
    const eventsInWeek = events.filter((event) => {
      const eventStartUnix = new DateObject({ date: event.start }).toUnix();
      const eventEndUnix = new DateObject({ date: event.end }).toUnix();

      // این شرط بررسی می‌کند که آیا بازه زمانی رویداد با بازه زمانی هفته تداخل دارد یا نه
      return eventStartUnix < weekEndUnix && eventEndUnix > weekStartUnix;
    });
    const timed = eventsInWeek.filter((event) => {
      const durationInHours =
        (new DateObject(event.end).toUnix() - new DateObject(event.start).toUnix()) / 3600;
      return durationInHours < 24;
    });
    const allDay = eventsInWeek.filter((event) => {
      const durationInHours =
        (new DateObject(event.end).toUnix() - new DateObject(event.start).toUnix()) / 3600;
      return durationInHours >= 24;
    });
    return { timedEvents: timed, allDayEvents: allDay };
  }, [weekDays, events]);

  const handleAddEvent = (event: CalendarEvent) => {
    addEvent(event);
  };

  return {
    hours,
    weekDays,
    timeSlots,
    timedEvents,
    allDayEvents,
    handleAddEvent,
  };
};
