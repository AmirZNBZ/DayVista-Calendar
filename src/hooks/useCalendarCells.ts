import dayjs from "dayjs";
import type { CalendarCell } from "../types/globalTypes";

export const generateCalendarCells = (year: number, month: number): CalendarCell[] => {
  const cells: CalendarCell[] = [];

  const startOfMonth = dayjs(new Date(year, month, 1));
  const endOfMonth = startOfMonth.endOf("month");

  const daysInMonth = endOfMonth.date();
  const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  const totalCells = 42; // 6 weeks * 7 days

  let key = 0;

  // Fill previous month days
  const prevMonth = startOfMonth.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = prevMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: key++,
      dayNumber: day,
      isCurrentMonth: false,
      date,
    });
  }

  // Fill current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = startOfMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: key++,
      dayNumber: day,
      isCurrentMonth: true,
      date,
    });
  }

  // Fill next month days
  const remaining = totalCells - cells.length;
  const nextMonth = startOfMonth.add(1, "month");

  for (let day = 1; day <= remaining; day++) {
    const date = nextMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: key++,
      dayNumber: day,
      isCurrentMonth: false,
      date,
    });
  }

  return cells;
};
