// store/calendarStore.ts
import { create } from "zustand";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import gregorian from "react-date-object/calendars/gregorian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian_en from "react-date-object/locales/gregorian_en";

type CalendarType = "gregorian" | "persian";

interface CalendarState {
  calendarType: CalendarType;
  viewDate: DateObject; // ✨ تاریخ فعلی به صورت آبجکت DateObject
  setCalendarType: (type: CalendarType) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendarType: "gregorian",
  // ✨ ۱. راه حل: از ابتدا با تقویم و زبان صحیح ساخته می‌شود
  viewDate: new DateObject({ calendar: gregorian, locale: gregorian_en }),

  setCalendarType: (type) => {
    const { calendarType } = get();
    if (calendarType === type) return;

    // ✨ تبدیل هوشمند تاریخ فعلی به سیستم جدید
    // DateObject خودش کار تبدیل تقویم رو به درستی انجام می‌ده
    const newCalendar = type === "persian" ? persian : gregorian;
    const newLocale = type === "persian" ? persian_fa : gregorian_en;
    const newViewDate = new DateObject({ calendar: newCalendar, locale: newLocale });

    set({
      calendarType: type,
      viewDate: newViewDate,
    });
  },

  goToNextMonth: () => {
    // ✨ نیازی به چک کردن نوع تقویم نیست، DateObject خودش هوشمنده
    set((state) => ({ viewDate: state.viewDate.add(1, "month") }));
  },

  goToPrevMonth: () => {
    // ✨ منطق ساده و یکسان برای هر دو تقویم
    set((state) => ({ viewDate: state.viewDate.subtract(1, "month") }));
  },

  goToToday: () => {
    const { calendarType } = get();
    // ✨ بازگشت به امروز با حفظ نوع تقویم فعلی
    const newCalendar = calendarType === "persian" ? persian : gregorian;
    const newLocale = calendarType === "persian" ? persian_fa : gregorian_en;
    set({ viewDate: new DateObject({ calendar: newCalendar, locale: newLocale }) });
  },
}));
