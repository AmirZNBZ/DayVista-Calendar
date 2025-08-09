import { useMemo } from "react";
import DateObject from "react-date-object";
import { useCalendarStore } from "../store/calendarStore";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";

export const useWeekView = () => {
  const eventStore = useEventStore();
  const viewDate = useCalendarStore((state) => state.viewDate);

  // آرایه‌ای از ۴۸ اسلات ۳۰ دقیقه‌ای
  const timeSlots = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  // آرایه‌ای از 24 ساعت
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const weekDays = useMemo(() => {
    console.log("Calculating weekDays for date:", viewDate.format());

    const startOfWeek = viewDate.toFirstOfWeek();
    const days: DateObject[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new DateObject(startOfWeek).add(i, "day"));
    }
    return days;
  }, [viewDate]);

  const addEvent = (event: CalendarEvent) => {
    eventStore.addEvent(event);
  };

  console.log("weekDays", weekDays);

  return {
    hours,
    weekDays,
    addEvent,
    timeSlots,
  };
};
