import DateObject from "react-date-object";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import Modal from "./modal/Modal";
import { useDayView } from "../hooks/useDayView";
import DayViewHeader from "./dayView/DayViewHeader";
import DayTimeGrid from "./dayView/DayTimeGrid";

const DayView = () => {
  const { events: allEvents, updateEvent, deleteEvent } = useEventStore();
  const { day, timeSlots, hours, handleAddEvent, allDayEvents, timedEvents } = useDayView();

  const handleUpdateEvent = (event: CalendarEvent) => {
    updateEvent(event);
  };

  const handleDeleteEvent = (id: string) => {
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
      allDay: false,
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

  return (
    <Modal>
      <div className="flex flex-col h-[85vh] bg-transparent text-gray-700">
        <DayViewHeader
          day={day}
          allDayEvents={allDayEvents}
          handleAddEvent={handleAddEvent}
          handleUpdateEvent={handleUpdateEvent}
          handleDeleteEvent={handleDeleteEvent}
          handleAllDayEventDrop={handleAllDayEventDrop}
        />
        <DayTimeGrid
          hours={hours}
          day={day}
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

export default DayView;