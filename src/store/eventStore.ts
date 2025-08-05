import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarEvent } from "../types/globalTypes";

interface EventStore {
  events: CalendarEvent[];

  draggedEventInfo: { id: string; duration: number } | null;
  dropTargetDate: string | null;

  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;

  setDraggedEventInfo: (info: { id: string; duration: number } | null) => void;
  setDropTargetDate: (date: string | null) => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      draggedEventInfo: null,
      dropTargetDate: null,
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
    }),
    {
      name: "calendar-events",
    }
  )
);
