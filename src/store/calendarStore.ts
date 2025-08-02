// store/calendarStore.ts
import { create } from "zustand";
import moment from "moment-jalaali";

type CalendarType = "gregorian" | "persian";

interface CalendarState {
  calendarType: CalendarType;
  viewDate: moment.Moment; // ✨ تاریخ فعلی به صورت آبجکت moment
  setCalendarType: (type: CalendarType) => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendarType: "persian",
  viewDate: moment(), // ✨ تاریخ اولیه، همین امروز است

  setCalendarType: (type) => {
    if (get().calendarType === type) return; // اگر نوع تقویم یکی بود، کاری نکن

    set({
      calendarType: type,
      // ✨ هنگام تغییر نوع تقویم، تاریخ فعلی هم به سیستم جدید تبدیل می‌شود
      viewDate: get().viewDate.clone(), // ما از clone استفاده می‌کنیم تا آبجکت اصلی تغییر نکنه
    });
  },

  goToNextMonth: () => {
    const { calendarType, viewDate } = get();
    const unit = calendarType === "persian" ? "jMonth" : "month";
    set({ viewDate: viewDate.clone().add(1, unit) });
  },

  goToPrevMonth: () => {
    const { calendarType, viewDate } = get();
    const unit = calendarType === "persian" ? "jMonth" : "month";
    set({ viewDate: viewDate.clone().subtract(1, unit) });
  },

  goToToday: () => {
    set({ viewDate: moment() }); // به سادگی به تاریخ امروز برمی‌گردیم
  },
}));
