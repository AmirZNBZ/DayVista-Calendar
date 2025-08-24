import DateObject from "react-date-object";
import type { CalendarEvent } from "../types/globalTypes";

interface LayoutEvent extends CalendarEvent {
  startDayIndex: number;
  span: number;
  rowIndex: number;
}

export const calculateAllDayEventLayout = (
  allDayEvents: CalendarEvent[],
  weekDays: DateObject[]
): { layoutEvents: LayoutEvent[]; dailyEventCounts: number[]; maxRows: number } => {
  if (!allDayEvents.length || !weekDays.length) {
    return { layoutEvents: [], dailyEventCounts: Array(7).fill(0), maxRows: 0 };
  }

  // ۱. رویدادها را بر اساس تاریخ شروع و سپس طولانی بودن مرتب می‌کنیم
  const sortedEvents = [...allDayEvents].sort((a, b) => {
    const startA = new DateObject(a.start).toUnix();
    const startB = new DateObject(b.start).toUnix();
    if (startA !== startB) {
      return startA - startB;
    }
    const durationA = new DateObject(a.end).toUnix() - startA;
    const durationB = new DateObject(b.end).toUnix() - startB;
    return durationB - durationA; // طولانی‌ترین اول
  });

  const layoutEvents: LayoutEvent[] = [];
  // ماتریسی برای نگهداری ردیف‌های اشغال شده در هر روز
  const lanes: (string | null)[][] = Array(7)
    .fill(0)
    .map(() => []);

  sortedEvents.forEach((event) => {
    const eventStart = new DateObject(event.start);
    const eventEnd = new DateObject(event.end);

    // ۲. ستون شروع و پایان رویداد را در هفته پیدا می‌کنیم
    let startDayIndex = weekDays.findIndex(
      (day) =>
        day.set({ hour: 0, minute: 0, second: 0 }).toUnix() ===
        eventStart.set({ hour: 0, minute: 0, second: 0 }).toUnix()
    );
    if (startDayIndex === -1 && eventStart.toUnix() < weekDays[0].toUnix()) {
      startDayIndex = 0;
    }

    let endDayIndex = weekDays.findIndex(
      (day) =>
        day.set({ hour: 0, minute: 0, second: 0 }).toUnix() ===
        eventEnd.set({ hour: 0, minute: 0, second: 0 }).toUnix()
    );
    if (
      endDayIndex === -1 &&
      eventEnd.toUnix() > weekDays[6].set({ hour: 23, minute: 59, second: 59 }).toUnix()
    ) {
      endDayIndex = 6;
    }

    if (startDayIndex === -1 || endDayIndex === -1 || startDayIndex > endDayIndex) return;

    // ۳. اولین ردیف خالی را برای این رویداد پیدا می‌کنیم
    let rowIndex = 0;
    while (true) {
      let isLaneFree = true;
      for (let i = startDayIndex; i <= endDayIndex; i++) {
        if (lanes[i][rowIndex] != null) {
          isLaneFree = false;
          break;
        }
      }
      if (isLaneFree) {
        break; // ردیف خالی پیدا شد
      }
      rowIndex++;
    }

    // ۴. ردیف پیدا شده را برای این رویداد اشغال می‌کنیم
    for (let i = startDayIndex; i <= endDayIndex; i++) {
      lanes[i][rowIndex] = event.id;
    }

    layoutEvents.push({
      ...event,
      startDayIndex,
      span: endDayIndex - startDayIndex + 1,
      rowIndex,
    });
  });

  const dailyEventCounts = lanes.map((dayLanes) => dayLanes.filter(Boolean).length);
  const maxRows = Math.max(0, ...lanes.map((dayLanes) => dayLanes.length));

  return { layoutEvents, dailyEventCounts, maxRows };
};
