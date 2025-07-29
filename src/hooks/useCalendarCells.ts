import { useMemo } from "react";

export type CalendarCell = {
  key: number;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  date: string | null;
};

export const useCalendarCells = (year: number, month: number): CalendarCell[] => {
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const startOffset = (startDay + 6) % 7; // تبدیل برای شروع هفته از شنبه
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = 42;

    return Array.from({ length: totalCells }, (_, index) => {
      const day = index - startOffset;
      const isCurrentMonth = day >= 1 && day <= daysInMonth;
      const date = isCurrentMonth ? new Date(year, month, day).toISOString().split("T")[0] : null;

      return {
        key: index,
        dayNumber: isCurrentMonth ? day : null,
        isCurrentMonth,
        date,
      };
    });
  }, [year, month]);

  return cells;
};
