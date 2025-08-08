// import { useMemo } from "react";
// import DateObject from "react-date-object";
// import { useCalendarStore } from "../store/calendarStore";
// import { useEventStore } from "../store/eventStore";
// import persian from "react-date-object/calendars/persian";
// import gregorian from "react-date-object/calendars/gregorian";
// import gregorian_en from "react-date-object/locales/gregorian_en";
// import persian_fa from "react-date-object/locales/persian_fa";
// import type { CalendarEvent } from "../types/globalTypes";

// export const useWeekView = () => {
//   const { events } = useEventStore();
//   const { viewDate, calendarType } = useCalendarStore();

//   const calendar = calendarType === "persian" ? persian : gregorian;
//   const locale = calendarType === "persian" ? persian_fa : gregorian_en;

//   const weekDays = useMemo(() => {
//     const startOfWeek = new DateObject(viewDate).toFirstOfWeek();
//     const days: DateObject[] = [];
//     for (let i = 0; i < 7; i++) {
//       days.push(new DateObject(startOfWeek).add(i, "day"));
//     }
//     return days;
//   }, [viewDate]);

//   console.log("weekDays", weekDays);

//   const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

//   console.log("hours", hours);

//   // ✅ منطق تفکیک رویدادها بر اساس مدت زمان آن‌ها
//   const { timedEvents, allDayEvents } = useMemo(() => {
//     if (weekDays.length === 0) return { timedEvents: [], allDayEvents: [] };

//     const weekStartUnix = weekDays[0].toUnix();
//     const weekEndUnix = new DateObject(weekDays[6]).set({ hour: 23, minute: 59, second: 59 }).toUnix();

//     const eventsInWeek: CalendarEvent[] = events.filter((event) => {
//       const eventStartUnix = new DateObject({ date: event.start }).toUnix();
//       // رویدادهایی را پیدا کن که در این هفته شروع می‌شوند
//       return eventStartUnix >= weekStartUnix && eventStartUnix <= weekEndUnix;
//     });

//     const timed: CalendarEvent[] = [];
//     const allDay: CalendarEvent[] = [];

//     eventsInWeek.forEach((event) => {
//       const start = new DateObject({ date: event.start });
//       const end = new DateObject({ date: event.end });

//       // محاسبه مدت زمان رویداد به ساعت
//       const durationInHours = (end.toUnix() - start.toUnix()) / 3600;

//       // اگر مدت زمان ۲۴ ساعت یا بیشتر بود، آن را تمام-روز در نظر بگیر
//       if (durationInHours >= 24) {
//         allDay.push(event);
//       } else {
//         timed.push(event);
//       }
//     });
//     return {
//       timedEvents: timed,
//       allDayEvents: allDay,
//     };
//   }, [events, weekDays]);

//   const filteredEvents = useMemo(() => {
//     if (weekDays.length === 0) return [];
//     const weekStartUnix = weekDays[0].toUnix();
//     const weekEndUnix = new DateObject(weekDays[6])
//       .set("hour", 23)
//       .set("minute", 59)
//       .set("second", 59)
//       .toUnix();
//     return events.filter((event) => {
//       const eventStartUnix = new DateObject({ date: event.start }).toUnix();
//       return eventStartUnix >= weekStartUnix && eventStartUnix <= weekEndUnix;
//     });
//   }, [events, weekDays]);

//   return {
//     hours,
//     locale,
//     calendar,
//     weekDays,
//     timedEvents,
//     allDayEvents,
//   };
// };

// src/hooks/useWeekView.ts
import { useMemo } from "react";
import DateObject from "react-date-object";
import { useCalendarStore } from "../store/calendarStore";

export const useWeekView = () => {
  const viewDate = useCalendarStore((state) => state.viewDate);

  const weekDays = useMemo(() => {
    const startOfWeek = new DateObject(viewDate).toFirstOfWeek();
    const days: DateObject[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new DateObject(startOfWeek).add(i, "day"));
    }
    return days;
  }, [viewDate]);

  // آرایه‌ای از ۴۸ اسلات ۳۰ دقیقه‌ای
  const timeSlots = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  return {
    hours,
    weekDays,
    timeSlots,
  };
};
