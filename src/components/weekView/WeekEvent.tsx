import { useEventStore } from "../../store/eventStore";
import type { CalendarEvent } from "../../types/globalTypes";
import AddEventForm from "../AddEventForm";
import Modal from "../modal/Modal";

interface WeekEventProps {
  event: CalendarEvent & {
    top: number;
    height: number;
    left: string;
    width: string;
  };
}

const WeekEvent = ({ event }: WeekEventProps) => {
  const eventStore = useEventStore();

  const eventStyle = {
    top: `${event.top}px`,
    height: `${event.height}px`,
    left: event.left,
    width: event.width,
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
          className="absolute p-1.5 overflow-hidden rounded-md text-sm border-l-2 cursor-grab active:cursor-grabbing"
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
