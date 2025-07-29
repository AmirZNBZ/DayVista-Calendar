import DayViewIcon from "../icons/DayView";
import WeekViewIcon from "../icons/WeekView";
import MonthViewIcon from "../icons/MonthView";
import AgendaViewIcon from "../icons/AgendaView";
import type { VIEW_OPTIONS_TYPES } from "../types/globalTypes";

export const VIEW_OPTIONS: VIEW_OPTIONS_TYPES[] = [
  { value: "dayGridMonth", label: "Month", icon: <MonthViewIcon /> },
  { value: "timeGridWeek", label: "Week", icon: <WeekViewIcon /> },
  { value: "timeGridDay", label: "Day", icon: <DayViewIcon /> },
  { value: "listWeek", label: "Agenda", icon: <AgendaViewIcon /> },
];
