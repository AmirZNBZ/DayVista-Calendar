import React, { useEffect } from "react";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";
import type { CalendarEvent, EventSegment } from "../../types/globalTypes";
import { useEventStore } from "../../store/eventStore";
import { useDrag } from "react-dnd";
import clsx from "clsx";
import { getEmptyImage } from "react-dnd-html5-backend";
import DateObject from "react-date-object";

interface EditEventProps {
  isEnd?: boolean;
  isStart?: boolean;
  event: EventSegment;
  topPosition?: number;
  isMultiDay?: boolean;
  viewMode?: "grid" | "list";
}

const EditEvent = ({
  event,
  isEnd,
  isStart,
  topPosition = 0,
  viewMode = "grid",
  isMultiDay = false,
}: EditEventProps) => {
  const eventStore = useEventStore();
  const setDraggedEventInfo = useEventStore((state) => state.setDraggedEventInfo);
  const setDropTargetDate = useEventStore((state) => state.setDropTargetDate);

  const updateEvent = (event: CalendarEvent) => {
    eventStore.updateEvent(event);
  };

  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
  };

  const [{ isDragging }, dragEventRef, preview] = useDrag({
    type: "event",
    item: () => {
      const start = new DateObject(event.start);
      const end = new DateObject(event.end);
      const duration = end.toUnix() - start.toUnix();
      setDraggedEventInfo({ id: event.id, duration });

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

  const listStyle: React.CSSProperties & { "--event-color"?: string } = {
    backgroundColor: event.color,
  };
  if (isMultiDay) {
    listStyle["--event-color"] = event.color;
  }

  return (
    <React.Fragment key={event.id}>
      <Modal.Open opens={event.id} stopClickPropagation={true}>
        {viewMode === "grid" ? (
          <li
            ref={dragEventRef as unknown as React.Ref<HTMLLIElement>}
            key={event.id}
            data-no-outside-click
            style={{
              backgroundColor: event.color,
              opacity: isDragging ? 0.5 : 1,
              top: `${topPosition + 20}px`,
            }}
            className={clsx(
              "absolute left-0 right-0 overflow-hidden cursor-pointer text-ellipsis whitespace-nowrap px-1 text-sm text-white hover:cursor-grab active:cursor-grabbing",
              isStart && "rounded-l-md",
              isEnd && "rounded-r-md",
              !isStart && "ml-[-8px]",
              !isEnd && "mr-[-1px]"
            )}
          >
            {isStart && <span className="font-bold">{event.title}</span>}
          </li>
        ) : (
          <li
            data-no-outside-click
            style={listStyle}
            className={clsx(
              "relative cursor-pointer p-2 text-sm text-white ",
              isMultiDay ? "rounded-l-md" : "rounded-md",
              isMultiDay && [
                "after:content-[''] after:absolute after:top-0 after:right-[-12px] after:w-0 after:h-0",
                "after:border-t-[18px] after:border-t-transparent",
                "after:border-b-[18px] after:border-b-transparent",
                "after:border-l-[12px] after:border-l-[var(--event-color)]",
              ]
            )}
          >
            <span className="font-bold">{event.title}</span>
          </li>
        )}
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

export default EditEvent;
