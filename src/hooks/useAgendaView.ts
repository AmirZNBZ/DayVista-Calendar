import { useMemo } from "react";
import DateObject from "react-date-object";
import type { CalendarEvent } from "../types/globalTypes";
import { useEventStore } from "../store/eventStore";
import { useCalendarStore } from "../store/calendarStore";
import { useGetCalendar } from "./useGetCalendar";

interface GroupedEvents {
  [key: string]: CalendarEvent[];
}

export const useAgendaView = (daysToDisplay: number = 7) => {
  const allEvents = useEventStore((state) => state.events);
  const viewDate = useCalendarStore((state) => state.viewDate);
  const { calendar, locale } = useGetCalendar();

  const groupedEvents = useMemo(() => {
    const startDate = new DateObject({ date: viewDate, calendar, locale })
      .toFirstOfWeek()
      .set({ hour: 0, minute: 0, second: 0 });
    const endDate = new DateObject({ date: startDate, calendar, locale })
      .add(daysToDisplay - 1, "days")
      .set({ hour: 23, minute: 59, second: 59 });

    const eventsInPeriod = allEvents.filter((event) => {
      const eventStart = new DateObject({ date: event.start, calendar, locale });
      return eventStart.toUnix() >= startDate.toUnix() && eventStart.toUnix() <= endDate.toUnix();
    });

    const sortedEvents = eventsInPeriod.sort(
      (a, b) =>
        new DateObject({ date: a.start, calendar, locale }).toUnix() -
        new DateObject({ date: b.start, calendar, locale }).toUnix()
    );

    const groups: GroupedEvents = {};
    sortedEvents.forEach((event) => {
      const eventDay = new DateObject({ date: event.start, calendar, locale }).format("YYYY/MM/DD");
      if (!groups[eventDay]) {
        groups[eventDay] = [];
      }
      groups[eventDay].push(event);
    });

    return groups;
  }, [allEvents, viewDate, daysToDisplay, calendar, locale]);

  return { groupedEvents };
};
