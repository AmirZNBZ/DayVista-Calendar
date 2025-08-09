import gregorian_en from "react-date-object/locales/gregorian_en";
import { useCalendarStore } from "../store/calendarStore";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export const useGetCalendar = () => {
  const { calendarType } = useCalendarStore();

  const calendar = calendarType === "persian" ? persian : gregorian;
  const locale = calendarType === "persian" ? persian_fa : gregorian_en;

  return {
    calendar,
    locale,
  };
};
