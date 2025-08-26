import DateObject from "react-date-object";
import { useEventStore } from "../../store/eventStore";
import type { CalendarEvent } from "../../types/globalTypes";
import AddEventForm from "../AddEventForm";
import Modal from "../modal/Modal";
import { useDrag } from "react-dnd";
import { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

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
  const setDraggedEventInfo = useEventStore((state) => state.setDraggedEventInfo);
  const setDropTargetDate = useEventStore((state) => state.setDropTargetDate);

  const [{ isDragging }, dragEventRef, preview] = useDrag({
    type: "event",
    item: () => {
      const start = new DateObject(event.start);
      const end = new DateObject(event.end);
      const duration = end.toUnix() - start.toUnix();
      setDraggedEventInfo({ id: event.id, duration, allDay: !!event.allDay });

      return { ...event };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: () => {
      setDraggedEventInfo(null);
      setDropTargetDate(null);
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const eventStyle = {
    top: `${event.top}px`,
    height: `${event.height}px`,
    left: event.left,
    width: event.width,
    opacity: isDragging ? 0.5 : 1,
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
          style={{ ...eventStyle, backgroundColor: `${event.color}20`, borderColor: event.color, zIndex: 10 }}
          className="absolute p-1.5 overflow-hidden rounded-md text-sm border-l-2 cursor-grab active:cursor-grabbing"
        >
          <p
            className="font-semibold"
            style={{ color: event.color }}
            ref={dragEventRef as unknown as React.Ref<HTMLParagraphElement>}
          >
            {event.title}
          </p>
          <p className="text-xs text-gray-600 mt-3">
            {new DateObject(event.start).format("hh:mm A")} - {new DateObject(event.end).format("hh:mm A")}
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
