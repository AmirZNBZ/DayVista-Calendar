import type React from "react";

export interface VIEW_OPTIONS_TYPES {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export type CalendarCell = {
  key: number | string;
  date: string | null;
  isCurrentMonth: boolean;
  dayNumber: number | null;
};

// export type EventColor = "blue" | "green" | "red" | "yellow" | "purple" | "gray";

export type CalendarEvent = {
  id: string;
  title: string;
  toDate: string; // ISO string format: YYYY-MM-DD
  toTime: string;
  // color: EventColor;
  color?: string;
  fromDate: string; // ISO string format: YYYY-MM-DD
  fromTime: string;
  description?: string;
};
