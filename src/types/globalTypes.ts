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
