import DateObject, { type Calendar, type Locale } from "react-date-object";
import type { CalendarEvent, EventSegment } from "../types/globalTypes";

export const processEventsForLayout = (
  locale: Locale,
  events: CalendarEvent[],
  visibleDays: { date: string }[],
  calendar: Omit<Calendar, "leapsLength">
): Map<string, EventSegment[]> => {
  const layoutMap = new Map<string, EventSegment[]>();
  visibleDays.forEach((day) => layoutMap.set(day.date, []));

  // رویدادها را بر اساس تاریخ شروع مرتب می‌کنیم
  const sortedEvents = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  for (const event of sortedEvents) {
    const startDate = new DateObject({ date: new Date(event.start), calendar, locale });
    const endDate = new DateObject({ date: new Date(event.end), calendar, locale });

    // پیدا کردن یک جایگاه (level) خالی برای این رویداد
    let level = 0;
    while (true) {
      let isLevelOccupied = false;
      const tempDate = new DateObject(startDate);
      while (tempDate.toUnix() <= endDate.toUnix()) {
        const dateStr = tempDate.format("YYYY-MM-DD");
        if (layoutMap.get(dateStr)?.some((e) => e.level === level)) {
          isLevelOccupied = true;
          break;
        }
        tempDate.add(1, "day");
      }
      if (!isLevelOccupied) break;
      level++;
    }

    // قرار دادن قطعه‌های رویداد در جایگاه پیدا شده
    const currentDate = new DateObject(startDate);
    while (currentDate.toUnix() <= endDate.toUnix()) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      if (layoutMap.has(dateStr)) {
        layoutMap.get(dateStr)!.push({
          ...event,
          level,
          isStart: currentDate.format("YYYY-MM-DD") === startDate.format("YYYY-MM-DD"),
          isEnd: currentDate.format("YYYY-MM-DD") === endDate.format("YYYY-MM-DD"),
        });
      }
      currentDate.add(1, "day");
    }
  }

  return layoutMap;
};
