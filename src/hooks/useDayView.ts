import { useMemo } from "react";
import DateObject from "react-date-object";
import { useEventStore } from "../store/eventStore";
import { useCalendarStore } from "../store/calendarStore";
import type { CalendarEvent } from "../types/globalTypes";
import { getDayBoundary } from "../helpers/getDayBoundary";

export const useDayView = () => {
  const { addEvent, events } = useEventStore();
  const viewDate = useCalendarStore((state) => state.viewDate);

  // 48 half-hour slots and 24 hours (for timeline labels)
  const timeSlots = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const day = useMemo(() => new DateObject(viewDate), [viewDate]);

  const { timedEvents, allDayEvents } = useMemo(() => {
    if (!day) return { timedEvents: [], allDayEvents: [] };

    const dayStartUnix = getDayBoundary(day, "start").toUnix();
    const dayEndUnix = getDayBoundary(day, "end").toUnix();

    const eventsInDay = events.filter((event) => {
      const eventStartUnix = new DateObject({ date: event.start }).toUnix();
      const eventEndUnix = new DateObject({ date: event.end }).toUnix();
      // overlap check
      return eventStartUnix < dayEndUnix && eventEndUnix > dayStartUnix;
    });

    const timed = eventsInDay.filter((event) => {
      const durationInHours =
        (new DateObject(event.end).toUnix() - new DateObject(event.start).toUnix()) / 3600;
      return durationInHours < 24 && !event.allDay;
    });

    const allDay = eventsInDay.filter((event) => {
      const durationInHours =
        (new DateObject(event.end).toUnix() - new DateObject(event.start).toUnix()) / 3600;
      return durationInHours >= 24 || event.allDay;
    });

    return { timedEvents: timed, allDayEvents: allDay };
  }, [events, day]);

  const handleAddEvent = (event: CalendarEvent) => {
    addEvent(event);
  };

  return {
    day,
    hours,
    timeSlots,
    timedEvents,
    allDayEvents,
    handleAddEvent,
  };
};