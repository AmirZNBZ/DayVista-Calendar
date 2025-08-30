import type React from "react";
import faJson from "../locale/fa.json";
import enJson from "../locale/en.json";
import type DateObject from "react-date-object";

export type ViewType = "Month" | "Week" | "Day" | "WeekList";
export interface VIEW_OPTIONS_TYPES {
  label: DictionaryKeys;
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
  end: DateObject; //
  start: DateObject; // ✨ فرمت ISO: "2025-08-22T10:30:00.000Z"
  color?: string;
  description?: string;
};

export interface EventSegment extends CalendarEvent {
  isStart: boolean;
  isEnd: boolean;
  level: number;
}

export type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;
export type DashPrefix<T extends string> = T extends "" ? "" : `-${T}`;

export type DotNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;
export type DashNestedKeys<T> = (
  T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${DashPrefix<DotNestedKeys<T[K]>>}`;
      }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

export type DictionaryKeys = DotNestedKeys<typeof enJson> | DotNestedKeys<typeof faJson>;
