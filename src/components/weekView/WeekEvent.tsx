import DateObject from "react-date-object";
import type { CalendarEvent } from "../../types/globalTypes";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";
import { useEventStore } from "../../store/eventStore";

interface WeekEventProps {
  event: CalendarEvent;
  day: DateObject;
}

const PIXEL_PER_HOURS = 64;
const PIXEL_PER_MINUTES = PIXEL_PER_HOURS / 60;

const WeekEvent = ({ event, day }: WeekEventProps) => {
  const eventStore = useEventStore();
  const eventStart = new DateObject({ date: event.start });
  const eventEnd = new DateObject({ date: event.end });

  // ✅ کد صحیح برای گرفتن شروع و پایان روز
  const dayStart = new DateObject(day).set({ hour: 0, minute: 0, second: 0 });
  const dayEnd = new DateObject(day).set({ hour: 23, minute: 59, second: 59 });

  const visualStart = eventStart.toUnix() > dayStart.toUnix() ? eventStart : dayStart;
  const visualEnd = eventEnd.toUnix() < dayEnd.toUnix() ? eventEnd : dayEnd;

  const top = visualStart.hour * PIXEL_PER_HOURS + visualStart.minute * PIXEL_PER_MINUTES;
  const durationInMinutes = (visualEnd.toUnix() - visualStart.toUnix()) / 60;
  const height = durationInMinutes * PIXEL_PER_MINUTES;

  const eventStyle = {
    top: `${top}px`,
    height: `${height}px`,
  };

  const updateEvent = (event: CalendarEvent) => {
    eventStore.updateEvent(event);
  };

  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
  };

  return (
    <>
      <Modal.Open opens={event.id} stopClickPropagation={true}>
        <div
          style={{ ...eventStyle, backgroundColor: `${event.color}20`, borderColor: event.color }}
          className="absolute right-1 left-1 p-1.5 overflow-hidden rounded-md text-sm border-l-2 cursor-grab active:cursor-grabbing"
        >
          <p className="font-semibold" style={{ color: event.color }}>
            {event.title}
          </p>
        </div>
      </Modal.Open>
      <Modal.Window name={event.id}>
        <AddEventForm
          toDate={event.end}
          onAdd={updateEvent}
          initialEvent={event}
          fromDate={event.start}
          onDelete={deleteEvent}
        />
      </Modal.Window>
    </>
  );
};

export default WeekEvent;
