import DayViewIcon from "../icons/DayView";
import WeekViewIcon from "../icons/WeekView";
import MonthViewIcon from "../icons/MonthView";
import AgendaViewIcon from "../icons/AgendaView";
import type { VIEW_OPTIONS_TYPES } from "../types/globalTypes";

export const VIEW_OPTIONS: VIEW_OPTIONS_TYPES[] = [
  { value: "Month", label: "Month", icon: <MonthViewIcon /> },
  { value: "Week", label: "Week", icon: <WeekViewIcon /> },
  { value: "Day", label: "Day", icon: <DayViewIcon /> },
  { value: "WeekList", label: "Agenda", icon: <AgendaViewIcon /> },
];

export const daysOfWeekEn: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const daysOfWeekFa: string[] = ["شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
