import React, { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEventStore } from "../../store/eventStore";
import type { CalendarEvent } from "../../types/globalTypes";
import DateObject from "react-date-object";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";

interface AllDayWeekEventProps {
  event: CalendarEvent & {
    startDayIndex: number;
    span: number;
    rowIndex: number;
  };
}

const AllDayWeekEvent = ({ event }: AllDayWeekEventProps) => {
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
    end: () => {
      setDraggedEventInfo(null);
      setDropTargetDate(null);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const updateEvent = (updatedEvent: CalendarEvent) => {
    eventStore.updateEvent(updatedEvent);
  };

  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
  };

  return (
    <React.Fragment key={event.id}>
      <Modal.Open opens={event.id} stopClickPropagation={true}>
        <div
          style={{
            gridColumn: `${event.startDayIndex + 1} / span ${event.span}`,
            top: `${event.rowIndex * 28}px`,
            backgroundColor: `${event.color}20`,
            borderColor: event.color,
            opacity: isDragging ? 0.5 : 1,
          }}
          className="absolute w-23/24 m-1 p-1 text-xs truncate rounded border-l-4 cursor-grab active:cursor-grabbing"
        >
          <p
            className="font-semibold w-fit cursor-move"
            style={{ color: event.color }}
            ref={dragEventRef as unknown as React.Ref<HTMLParagraphElement>}
          >
            {event.title} -{" "}
            <span className="text-xs text-gray-600">
              {new DateObject(event.start).format("hh:mm A")} - {new DateObject(event.end).format("hh:mm A")}
            </span>
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
    </React.Fragment>
  );
};

export default AllDayWeekEvent;
