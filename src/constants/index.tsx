import DayViewIcon from "../icons/DayView";
import WeekViewIcon from "../icons/WeekView";
import MonthViewIcon from "../icons/MonthView";
import AgendaViewIcon from "../icons/AgendaView";
import type { DictionaryKeys, VIEW_OPTIONS_TYPES } from "../types/globalTypes";

export const VIEW_OPTIONS: VIEW_OPTIONS_TYPES[] = [
  { value: "Month", label: "header.month", icon: <MonthViewIcon /> },
  { value: "Week", label: "header.week", icon: <WeekViewIcon /> },
  { value: "Day", label: "header.day", icon: <DayViewIcon /> },
  { value: "WeekList", label: "header.agenda", icon: <AgendaViewIcon /> },
];

export const weekDays: DictionaryKeys[] = [
  "daysOfWeek.sun",
  "daysOfWeek.mon",
  "daysOfWeek.tue",
  "daysOfWeek.wed",
  "daysOfWeek.thu",
  "daysOfWeek.fri",
  "daysOfWeek.sat",
];
