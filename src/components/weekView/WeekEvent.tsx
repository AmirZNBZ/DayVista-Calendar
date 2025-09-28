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
  const setDraggedEventInfo = useEventStore(
    (state) => state.setDraggedEventInfo
  );
  const setDropTargetDate = useEventStore((state) => state.setDropTargetDate);

  const [{}, dragEventRef, preview] = useDrag({
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

  // Resize handles (top & bottom)
  const [{}, dragTop, previewTop] = useDrag({
    type: "resize-event",
    item: () => ({
      id: event.id,
      edge: "start",
      title: event.title,
      color: event.color,
    }),
    collect: (monitor) => ({ isResizingTop: !!monitor.isDragging() }),
    end: () => {
      setDraggedEventInfo(null);
      setDropTargetDate(null);
    },
  });
  const [{}, dragBottom, previewBottom] = useDrag({
    type: "resize-event",
    item: () => ({
      id: event.id,
      edge: "end",
      title: event.title,
      color: event.color,
    }),
    collect: (monitor) => ({ isResizingBottom: !!monitor.isDragging() }),
    end: () => {
      setDraggedEventInfo(null);
      setDropTargetDate(null);
    },
  });

  useEffect(() => {
    // hide default preview for resize handles
    previewTop(getEmptyImage(), { captureDraggingState: true });
    previewBottom(getEmptyImage(), { captureDraggingState: true });
  }, [previewTop, previewBottom]);
  // const resizing = isResizingTop || isResizingBottom;
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
          style={{
            ...eventStyle,
            backgroundColor: `${event.color}20`,
            borderColor: event.color,
            zIndex: 10,
          }}
          className="absolute p-1.5 overflow-hidden rounded-md text-sm border-l-2 cursor-grab active:cursor-grabbing"
        >
          {/* 🔹 Resize handle - top */}
          <div
            ref={dragTop as unknown as React.Ref<HTMLDivElement>}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-x-0 -top-1 h-2 cursor-ns-resize z-20"
          />

          {/* 🔹 Resize handle - bottom */}
          <div
            ref={dragBottom as unknown as React.Ref<HTMLDivElement>}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute inset-x-0 -bottom-1 h-2 cursor-ns-resize z-20"
          />

          <p
            className="font-semibold cursor-move w-fit"
            style={{ color: event.color }}
            ref={dragEventRef as unknown as React.Ref<HTMLParagraphElement>}
          >
            {event.title}
          </p>
          <p className="text-xs text-gray-600 mt-3">
            {new DateObject(event.start).format("hh:mm A")} -
            {new DateObject(event.end).format("hh:mm A")}
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
