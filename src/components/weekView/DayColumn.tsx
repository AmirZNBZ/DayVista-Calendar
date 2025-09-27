import React, { useMemo, useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import DateObject from "react-date-object";
import { calculateTimedEventLayout } from "../../utils/weekEventLayout";
import type { CalendarEvent } from "../../types/globalTypes";
import Modal from "../modal/Modal";
import AddEventForm from "../AddEventForm";
import WeekEvent from "./WeekEvent";
import TimeSlot from "./TimeSlot";
import { getDayBoundary } from "../../helpers/getDayBoundary";
import { useGetCalendar } from "../../hooks/useGetCalendar";
import { useEventStore } from "../../store/eventStore";

interface DayColumnProps {
  showNowIndicator?: boolean;
  day: DateObject;
  timedEvents: CalendarEvent[];
  timeSlots: number[];
  handleTimedEventDrop: (eventId: string, newStartDate: DateObject) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

const DayColumn = ({
  day,
  timedEvents,
  timeSlots,
  handleTimedEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  showNowIndicator = false,
}: DayColumnProps) => {
  const { calendar, locale } = useGetCalendar();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nowTop, setNowTop] = useState<number | null>(null);

  useEffect(() => {
    if (!showNowIndicator) {
      setNowTop(null);
      return;
    }
    const computeTop = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      if (!containerHeight) return;
      const minutesPerPx = 1440 / containerHeight;

      const now = new DateObject({ calendar, locale });
      const isSameDay = day.format("YYYY-MM-DD") === now.format("YYYY-MM-DD");
      if (!isSameDay) {
        setNowTop(null);
        return;
      }

      const minutes = now.hour * 60 + now.minute;
      const topPx = minutes / minutesPerPx;
      setNowTop(topPx);
    };

    computeTop();
    const id = setInterval(computeTop, 60 * 1000);
    const onResize = () => computeTop();
    window.addEventListener("resize", onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", onResize);
    };
  }, [day, showNowIndicator, calendar, locale]);

  const { events, updateEvent } = useEventStore();
  const timedEventsForDay = useMemo(() => {
    const dayStartUnix = getDayBoundary(day, "start").toUnix();
    const dayEndUnix = getDayBoundary(day, "end").toUnix();
    return timedEvents.filter((event) => {
      const eventStartUnix = new DateObject(event.start).toUnix();
      const eventEndUnix = new DateObject(event.end).toUnix();
      return eventStartUnix < dayEndUnix && eventEndUnix > dayStartUnix;
    });
  }, [day, timedEvents]);

  const { layoutTimedEvents, moreIndicators } = useMemo(
    () => calculateTimedEventLayout(timedEventsForDay, day),
    [timedEventsForDay, day]
  );

  // live resize: update event during drag-hover (snapped to 30m)
  type ResizeItem = { id: string; edge: "start" | "end" };
  const lastAppliedRef = useRef<{
    id: string;
    edge: "start" | "end";
    rounded: number;
  } | null>(null);

  const [{ isResizing }, dropRef] = useDrop<
    ResizeItem,
    void,
    { isResizing: boolean }
  >(
    () => ({
      accept: "resize-event",
      collect: (monitor) => ({
        isResizing: !!monitor.isOver() && !!monitor.getItem(),
      }),

      // 🔴 live update while dragging
      hover: (item, monitor) => {
        if (!containerRef.current) return;
        const client = monitor.getClientOffset();
        if (!client) return;

        const rect = containerRef.current.getBoundingClientRect();
        const y = client.y - rect.top;
        const H = rect.height;

        // minutes from top of the day
        const mins = Math.max(0, Math.min(1439, Math.round((y / H) * 1440)));
        // snap to 30 minutes
        const rounded = Math.round(mins / 30) * 30;

        // avoid redundant updates while hovering within the same slot
        const prev = lastAppliedRef.current;
        if (
          prev &&
          prev.id === item.id &&
          prev.edge === item.edge &&
          prev.rounded === rounded
        )
          return;

        const ev = events.find((e) => e.id === item.id);
        if (!ev) return;

        const start0 = new DateObject(ev.start);
        const end0 = new DateObject(ev.end);
        const toDayTime = (m: number) =>
          new DateObject(day).set({
            hour: Math.floor(m / 60),
            minute: m % 60,
            second: 0,
          });

        let newStart = start0;
        let newEnd = end0;

        if (item.edge === "start") newStart = toDayTime(rounded);
        if (item.edge === "end") newEnd = toDayTime(rounded);

        // clamp (>=30m, inside the day)
        const minStart = new DateObject(day).set({
          hour: 0,
          minute: 0,
          second: 0,
        });
        const maxStart = new DateObject(newEnd).subtract(30, "minute");
        if (newStart.toUnix() < minStart.toUnix()) newStart = minStart;
        if (newStart.toUnix() > maxStart.toUnix()) newStart = maxStart;

        const minEnd = new DateObject(newStart).add(30, "minute");
        const maxEnd = new DateObject(day).set({
          hour: 23,
          minute: 59,
          second: 59,
        });
        if (newEnd.toUnix() < minEnd.toUnix()) newEnd = minEnd;
        if (newEnd.toUnix() > maxEnd.toUnix()) newEnd = maxEnd;

        // ✅ live update the real event (box will move/resize immediately)
        updateEvent({ ...ev, start: newStart, end: newEnd });

        // remember what we applied for this hover frame
        const edgeMinute =
          item.edge === "start"
            ? newStart.hour * 60 + newStart.minute
            : newEnd.hour * 60 + newEnd.minute;
        lastAppliedRef.current = {
          id: item.id,
          edge: item.edge,
          rounded: edgeMinute,
        };
      },

      // keep drop for final clamp (already applied during hover, but harmless)
      drop: (item, monitor) => {
        if (!containerRef.current) return;
        const client = monitor.getClientOffset();
        if (!client) return;

        const rect = containerRef.current.getBoundingClientRect();
        const y = client.y - rect.top;
        const H = rect.height;

        const minutes = Math.max(0, Math.min(1439, Math.round((y / H) * 1440)));
        const rounded = Math.round(minutes / 30) * 30;

        const ev = events.find((e) => e.id === item.id);
        if (!ev) return;

        const start0 = new DateObject(ev.start);
        const end0 = new DateObject(ev.end);

        if (item.edge === "start") {
          const newStart = new DateObject(day).set({
            hour: Math.floor(rounded / 60),
            minute: rounded % 60,
            second: 0,
          });
          const minStart = new DateObject(day).set({
            hour: 0,
            minute: 0,
            second: 0,
          });
          const maxStart = new DateObject(end0).subtract(30, "minute");
          const clamped =
            newStart.toUnix() < minStart.toUnix()
              ? minStart
              : newStart.toUnix() > maxStart.toUnix()
                ? maxStart
                : newStart;
          updateEvent({ ...ev, start: clamped });
        } else {
          const newEnd = new DateObject(day).set({
            hour: Math.floor(rounded / 60),
            minute: rounded % 60,
            second: 0,
          });
          const minEnd = new DateObject(start0).add(30, "minute");
          const maxEnd = new DateObject(day).set({
            hour: 23,
            minute: 59,
            second: 59,
          });
          const clamped =
            newEnd.toUnix() < minEnd.toUnix()
              ? minEnd
              : newEnd.toUnix() > maxEnd.toUnix()
                ? maxEnd
                : newEnd;
          updateEvent({ ...ev, end: clamped });
        }
      },
    }),
    [events, day, updateEvent]
  );

  return (
    <div
      key={day.toUnix()}
      ref={(el) => {
        containerRef.current = el;
        (dropRef as any)(el);
      }}
      className="relative grid grid-rows-48 border-l border-gray-200"
    >
      {/* red NOW line */}
      {nowTop !== null && (
        <div
          className="absolute left-0 right-0 z-20 pointer-events-none"
          style={{ top: `${nowTop}px` }}
        >
          <div className="h-0.5 bg-red-500" />
          <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-red-500" />
        </div>
      )}

      {layoutTimedEvents.map((event) => (
        <WeekEvent key={event.id} event={event} />
      ))}

      {moreIndicators.map((indicator) => (
        <React.Fragment key={indicator.id}>
          <Modal.Open opens={indicator.id} stopClickPropagation={true}>
            <div
              className="absolute p-1.5 rounded-md text-sm cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center z-10"
              style={{
                top: `${indicator.top}px`,
                height: `${indicator.height}px`,
                left: indicator.left,
                width: indicator.width,
              }}
            >
              <p className="font-semibold text-gray-700">
                +{indicator.count} more
              </p>
            </div>
          </Modal.Open>
          <Modal.Window name={indicator.id}>
            <div className="p-4 bg-white rounded-lg w-96">
              <h3 className="text-lg font-bold mb-3">
                Events for {day.format("DD MMMM")}
              </h3>
              <ul className="max-h-80 overflow-y-auto">
                {indicator.events.map((event: CalendarEvent) => (
                  <Modal key={event.id}>
                    <Modal.Open
                      opens={`more-open-event-modal-${event.id}`}
                      stopClickPropagation
                    >
                      <li
                        className="mb-2 p-2 rounded flex items-center cursor-pointer"
                        style={{ backgroundColor: `${event.color}20` }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mr-3"
                          style={{ backgroundColor: event.color }}
                        />
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: event.color }}
                          >
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new DateObject(event.start).format("hh:mm A")} -{" "}
                            {new DateObject(event.end).format("hh:mm A")}
                          </p>
                        </div>
                      </li>
                    </Modal.Open>
                    <Modal.Window name={`more-open-event-modal-${event.id}`}>
                      <AddEventForm
                        toDate={event.end}
                        initialEvent={event}
                        fromDate={event.start}
                        onAdd={handleUpdateEvent}
                        onDelete={handleDeleteEvent}
                      />
                    </Modal.Window>
                  </Modal>
                ))}
              </ul>
            </div>
          </Modal.Window>
        </React.Fragment>
      ))}

      {timeSlots.map((slotIndex) => {
        const fromDateObj = new DateObject(day).set({
          hour: Math.floor(slotIndex / 2),
          minute: (slotIndex % 2) * 30,
          second: 0,
        });
        const toDateObj = new DateObject(fromDateObj).add(30, "minutes");
        const modalId = `${day.toUnix()}-${slotIndex}`;
        return (
          <React.Fragment key={modalId}>
            <TimeSlot
              day={day}
              slotIndex={slotIndex}
              onEventDrop={handleTimedEventDrop}
            >
              <Modal.Open stopClickPropagation opens={modalId}>
                <div className="h-full w-full hover:bg-amber-500/10 cursor-pointer" />
              </Modal.Open>
            </TimeSlot>
            <Modal.Window name={modalId}>
              <AddEventForm
                onAdd={handleAddEvent}
                toDate={toDateObj}
                fromDate={fromDateObj}
              />
            </Modal.Window>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DayColumn;
