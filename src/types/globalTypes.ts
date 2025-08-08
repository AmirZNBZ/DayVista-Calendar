import type React from "react";

export type ViewType = "Month" | "Week" | "Day" | "WeekList";
export interface VIEW_OPTIONS_TYPES {
  label: string;
  value: ViewType;
  icon: React.ReactNode;
}

export type CalendarCell = {
  key: number | string;
  date: string | null;
  isCurrentMonth: boolean;
  dayNumber: number | null;
};

export type EventColor = "blue" | "green" | "red" | "yellow" | "purple" | "gray";

export type CalendarEvent = {
  id: string;
  title: string;
  allDay?: boolean;
  // color: EventColor;
  end: string; //
  start: string; // ✨ فرمت ISO: "2025-08-22T10:30:00.000Z"
  color?: string;
  description?: string;
};

export interface EventSegment extends CalendarEvent {
  isStart: boolean;
  isEnd: boolean;
  level: number;
}
