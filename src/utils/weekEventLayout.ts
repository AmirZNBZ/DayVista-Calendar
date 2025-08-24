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

  const sortedEvents = [...allDayEvents].sort((a, b) => {
    const startA = new DateObject(a.start).toUnix();
    const startB = new DateObject(b.start).toUnix();
    if (startA !== startB) {
      return startA - startB;
    }
    const durationA = new DateObject(a.end).toUnix() - startA;
    const durationB = new DateObject(b.end).toUnix() - startB;
    return durationB - durationA;
  });

  const layoutEvents: LayoutEvent[] = [];
  const lanes: (string | null)[][] = Array(7)
    .fill(0)
    .map(() => []);

  sortedEvents.forEach((event) => {
    const eventStart = new DateObject(event.start);
    const eventEnd = new DateObject(event.end);

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
        break;
      }
      rowIndex++;
    }

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

const PIXEL_PER_HOURS = 64;
const PIXEL_PER_MINUTES = PIXEL_PER_HOURS / 60;

interface TimedLayoutEvent extends CalendarEvent {
  top: number;
  height: number;
  left: string;
  width: string;
}

const MAX_VISIBLE_TIMED_EVENTS = 2; // حداکثر تعداد رویدادهای قابل نمایش کنار هم

// ✅ کل این تابع را جایگزین نسخه قبلی کن
export const calculateTimedEventLayout = (
  eventsForDay: CalendarEvent[],
  day: DateObject
): { layoutTimedEvents: TimedLayoutEvent[]; moreIndicators: any[] } => {
  if (!eventsForDay.length) return { layoutTimedEvents: [], moreIndicators: [] };

  const dayStartUnix = day.set({ hour: 0, minute: 0, second: 0 }).toUnix();
  const dayEndUnix = day.set({ hour: 23, minute: 59, second: 59 }).toUnix();

  // مرحله اول: پیش‌پردازش رویدادها (مشابه قبل)
  const processedEvents = eventsForDay.map((event, index) => {
    // ... (منطق محاسبه top, height, startUnix, endUnix مشابه تابع قبلی است) ...
    const start = new DateObject(event.start);
    const end = new DateObject(event.end);
    const startUnix = start.toUnix();
    const endUnix = end.toUnix();
    const visualStartUnix = Math.max(startUnix, dayStartUnix);
    const visualEndUnix = Math.min(endUnix, dayEndUnix);
    const visualStartDate = new DateObject({
      date: visualStartUnix * 1000,
      calendar: day.calendar,
      locale: day.locale,
    });
    const top = visualStartDate.hour * PIXEL_PER_HOURS + visualStartDate.minute * PIXEL_PER_MINUTES;
    const durationInMinutes = (visualEndUnix - visualStartUnix) / 60;
    const height = durationInMinutes * PIXEL_PER_MINUTES;

    return { ...event, index, top, height, startUnix, endUnix, columnIndex: -1 };
  });

  // مرحله دوم: ساخت گراف تداخل رویدادها
  const adj = processedEvents.map(() => [] as number[]);
  for (let i = 0; i < processedEvents.length; i++) {
    for (let j = i + 1; j < processedEvents.length; j++) {
      if (processedEvents[i].endUnix > processedEvents[j].startUnix) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }

  // مرحله سوم: پیدا کردن گروه‌های تداخلی با استفاده از جستجو در گراف
  const groups: (typeof processedEvents)[] = [];
  const visited = new Array(processedEvents.length).fill(false);
  for (let i = 0; i < processedEvents.length; i++) {
    if (!visited[i]) {
      const group: typeof processedEvents = [];
      const stack = [i];
      visited[i] = true;
      while (stack.length > 0) {
        const u = stack.pop()!;
        group.push(processedEvents[u]);
        adj[u].forEach((v) => {
          if (!visited[v]) {
            visited[v] = true;
            stack.push(v);
          }
        });
      }
      groups.push(group);
    }
  }

  const layoutTimedEvents: TimedLayoutEvent[] = [];
  const moreIndicators: any[] = [];

  // مرحله چهارم: پردازش هر گروه و تصمیم‌گیری برای نمایش عادی یا دکمه "more"
  groups.forEach((group, groupIndex) => {
    group.sort((a, b) => a.startUnix - b.startUnix || b.endUnix - a.endUnix);

    // تخصیص ستون به هر رویداد در گروه
    let maxColumns = 0;
    group.forEach((event) => {
      event.columnIndex = -1;
    });
    group.forEach((event) => {
      let col = 0;
      const occupiedColumns = new Set<number>();
      group.forEach((otherEvent) => {
        if (
          event !== otherEvent &&
          event.endUnix > otherEvent.startUnix &&
          event.startUnix < otherEvent.endUnix &&
          otherEvent.columnIndex !== -1
        ) {
          occupiedColumns.add(otherEvent.columnIndex);
        }
      });
      while (occupiedColumns.has(col)) {
        col++;
      }
      event.columnIndex = col;
      maxColumns = Math.max(maxColumns, col + 1);
    });

    if (maxColumns <= MAX_VISIBLE_TIMED_EVENTS) {
      // حالت عادی: همه رویدادها نمایش داده می‌شوند
      group.forEach((event) => {
        const width = 100 / maxColumns;
        const left = event.columnIndex * width;
        layoutTimedEvents.push({ ...event, width: `calc(${width}% - 4px)`, left: `${left}%` });
      });
    } else {
      // حالت فشرده: نمایش ۲ رویداد و دکمه "more"
      const width = 100 / MAX_VISIBLE_TIMED_EVENTS;

      // نمایش رویدادهای ستون اول
      group
        .filter((e) => e.columnIndex === 0)
        .forEach((event) => {
          layoutTimedEvents.push({ ...event, width: `calc(${width}% - 4px)`, left: `0%` });
        });

      // پیدا کردن اولین رویداد برای نمایش دکمه "more" در ستون دوم
      const hiddenEvents = group.filter((e) => e.columnIndex >= 1);
      const firstHiddenEvent = hiddenEvents.sort((a, b) => a.startUnix - b.startUnix)[0];

      if (firstHiddenEvent) {
        moreIndicators.push({
          id: `more-${day.toUnix()}-${groupIndex}`,
          top: firstHiddenEvent.top,
          height: firstHiddenEvent.height,
          left: `${width}%`,
          width: `calc(${width}% - 4px)`,
          count: hiddenEvents.length,
          events: group.sort((a, b) => a.startUnix - b.startUnix), // همه رویدادها برای مودال
        });
      }
    }
  });

  return { layoutTimedEvents, moreIndicators };
};
