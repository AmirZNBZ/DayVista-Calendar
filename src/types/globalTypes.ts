import type React from "react";

export interface VIEW_OPTIONS_TYPES {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export type CalendarCell = {
  key: number;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  date: string | null;
};

// export type EventColor = "blue" | "green" | "red" | "yellow" | "purple" | "gray";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  fromDate: string; // ISO string format: YYYY-MM-DD
  toDate: string; // ISO string format: YYYY-MM-DD
  fromTime: string;
  toTime: string;
  // color: EventColor;
  color?: string;
};
