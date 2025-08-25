import DateObject from "react-date-object";
import { useGetCalendar } from "../hooks/useGetCalendar";
import { useWeekView } from "../hooks/useWeekView";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import Modal from "./modal/Modal";
import TimeGrid from "./weekView/TimeGrid";
import WeekViewHeader from "./weekView/WeekViewHeader";

const WeekView = () => {
  const { calendar } = useGetCalendar();
  const { events: allEvents, updateEvent, deleteEvent } = useEventStore();
  const { weekDays, timeSlots, hours, handleAddEvent, allDayEvents, timedEvents } = useWeekView();

  const handleUpdateEvent = (event: CalendarEvent) => {
    updateEvent(event);
  };

  const handleDeleteEvent = (id: CalendarEvent["id"]) => {
    deleteEvent(id);
  };

  const handleTimedEventDrop = (eventId: string, newStartDate: DateObject) => {
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) return;

    const start = new DateObject(event.start);
    const end = new DateObject(event.end);
    const duration = end.toUnix() - start.toUnix();

    const newEndDate = new DateObject(newStartDate).add(duration, "seconds");

    updateEvent({
      ...event,
      start: newStartDate,
      end: newEndDate,
    });
  };

  const handleAllDayEventDrop = (eventId: string, newDay: DateObject) => {
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) return;

    const originalStart = new DateObject(event.start);
    const end = new DateObject(event.end);
    const duration = end.toUnix() - originalStart.toUnix();

    const newStartDate = new DateObject(newDay).set({
      hour: originalStart.hour,
      minute: originalStart.minute,
      second: originalStart.second,
    });

    const newEndDate = new DateObject(newStartDate).add(duration, "seconds");

    updateEvent({
      ...event,
      start: newStartDate,
      end: newEndDate,
      allDay: true,
    });
  };

  console.log(calendar);

  return (
    <Modal>
      <div className="flex flex-col h-[85vh] bg-white text-gray-700">
        <WeekViewHeader
          weekDays={weekDays}
          allDayEvents={allDayEvents}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          handleDeleteEvent={handleDeleteEvent}
          handleAllDayEventDrop={handleAllDayEventDrop}
        />

        <TimeGrid
          hours={hours}
          weekDays={weekDays}
          timedEvents={timedEvents}
          timeSlots={timeSlots}
          handleTimedEventDrop={handleTimedEventDrop}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          handleDeleteEvent={handleDeleteEvent}
        />
      </div>
    </Modal>
  );
};

export default WeekView;
