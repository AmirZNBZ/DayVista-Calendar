import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent } from "../types/globalTypes";
import type DateObject from "react-date-object";

interface EventStore {
  events: CalendarEvent[];

  draggedEventInfo: { id: string; duration: number; allDay?: boolean } | null;
  dropTargetDate: DateObject | null;
  activeDropZone: "allday" | "timed" | null;

  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;

  setDraggedEventInfo: (info: { id: string; duration: number; allDay?: boolean } | null) => void;
  setDropTargetDate: (date: DateObject | null) => void;
  setActiveDropZone: (zone: "allday" | "timed" | null) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      draggedEventInfo: null,
      dropTargetDate: null,
      activeDropZone: null,
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (event) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === event.id ? event : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      setDraggedEventInfo(info) {
        set({ draggedEventInfo: info });
      },
      setDropTargetDate(date) {
        set({ dropTargetDate: date });
      },
      setActiveDropZone(zone) {
        set({ activeDropZone: zone });
      },
    }),
    {
      name: "calendar-events",
    }
  )
);
