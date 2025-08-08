import { create } from "zustand";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";
import type { ViewType } from "../types/globalTypes";

type CalendarType = "gregorian" | "persian";

export interface CalendarState {
  calendarType: CalendarType;
  viewDate: DateObject;
  setCalendarType: (type: CalendarType) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
  viewType: ViewType;
  setViewType: (view: ViewType) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  viewType: "Week",
  calendarType: "gregorian",
  viewDate: new DateObject({ calendar: gregorian, locale: gregorian_en }),

  setCalendarType: (type) => {
    const { calendarType } = get();
    if (calendarType === type) return;

    const newCalendar = type === "persian" ? persian : gregorian;
    const newLocale = type === "persian" ? persian_fa : gregorian_en;
    const newViewDate = new DateObject({ calendar: newCalendar, locale: newLocale });

    set({
      calendarType: type,
      viewDate: newViewDate,
    });
  },

  goToNextMonth: () => {
    const { viewType } = get();
    switch (viewType) {
      case "Month":
        set((state) => ({ viewDate: state.viewDate.add(1, "month") }));
        break;
      case "Week":
        set((state) => ({ viewDate: state.viewDate.add(7, "day") }));
        break;
      default:
        break;
    }
  },

  goToPrevMonth: () => {
    const { viewType } = get();
    switch (viewType) {
      case "Month":
        set((state) => ({ viewDate: state.viewDate.subtract(1, "month") }));
        break;
      case "Week":
        set((state) => ({ viewDate: state.viewDate.subtract(7, "day") }));
        break;

      default:
        break;
    }
  },

  goToToday: () => {
    const { calendarType } = get();
    const newCalendar = calendarType === "persian" ? persian : gregorian;
    const newLocale = calendarType === "persian" ? persian_fa : gregorian_en;
    set({ viewDate: new DateObject({ calendar: newCalendar, locale: newLocale }) });
  },

  setViewType: (type) => {
    const { viewType } = get();
    if (type === viewType) return;

    set({ viewType: type });
  },
}));
