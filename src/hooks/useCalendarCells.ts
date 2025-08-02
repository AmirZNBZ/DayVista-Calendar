import moment from "moment-jalaali";
import type { CalendarCell, CalendarType } from "../types/globalTypes";

export const generateCalendarCells = (
  year: number,
  month: number,
  calendarType: CalendarType
): CalendarCell[] => {
  const cells: CalendarCell[] = [];
  const totalCells = 42; // 6 weeks * 7 days

  // let dateCursor = moment(new Date(year, month, 1));
  let dateCursor;
  if (calendarType === "persian") {
    // moment-jalaali ماه را از 1 تا 12 می‌شناسد
    dateCursor = moment(`${year}/${month + 1}/1`, "jYYYY/jM/jD");
  } else {
    // moment ماه را از 0 تا 11 می‌شناسد
    dateCursor = moment({ year, month, day: 1 });
  }

  let startOfMonth, endOfMonth, prevMonth, nextMonth;
  if (calendarType === "persian") {
    startOfMonth = dateCursor.clone().startOf("jMonth");
    endOfMonth = dateCursor.clone().endOf("jMonth");
    prevMonth = startOfMonth.clone().subtract(1, "jMonth");
    nextMonth = startOfMonth.clone().add(1, "jMonth");
  } else {
    startOfMonth = dateCursor.clone().startOf("month");
    endOfMonth = dateCursor.clone().endOf("month");
    prevMonth = startOfMonth.clone().subtract(1, "month");
    nextMonth = startOfMonth.clone().add(1, "month");
  }

  if (calendarType === "persian") dateCursor = moment(`${year}/${month + 1}`, "jYYYY/jM/jD");

  // const startOfMonth = dateCursor.clone().startOf(calendarType === "persian" ? "jMonth" : "month");
  // const endOfMonth = dateCursor.clone().endOf(calendarType === "persian" ? "jMonth" : "month");
  const daysInMonth = endOfMonth.jDate();

  // const daysInMonth = endOfMonth.date();
  // const endOfMonth = startOfMonth.endOf("month");
  // const startOfMonth = d.year(year).month(month).startOf("month");
  const startDayOfWeek = calendarType === "persian" ? (startOfMonth.day() + 1) % 7 : startOfMonth.day();
  // const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

  // Fill previous month days
  // const prevMonth = startOfMonth.clone().subtract(1, calendarType === "persian" ? "jMonth" : "month");
  // const prevMonth = startOfMonth.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const dateObj = prevMonth.clone().date(day);
    // const date = prevMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber: day,
      isCurrentMonth: false,
      date: dateObj.format("YYYY-MM-DD"),
    });
  }

  // Fill current month day
  for (let day = 1; day <= (calendarType === "persian" ? daysInMonth : dateCursor.daysInMonth()); day++) {
    console.log("day is", day);
    // for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = startOfMonth.clone().date(day);
    // const date = startOfMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber: day,
      isCurrentMonth: true,
      date: dateObj.format("YYYY-MM-DD"),
    });
  }

  // Fill next month days
  const remaining = totalCells - cells.length;
  // const nextMonth = startOfMonth.clone().add(1, calendarType === "persian" ? "jMonth" : "month");
  // const nextMonth = startOfMonth.add(1, "month");

  for (let day = 1; day <= remaining; day++) {
    const dateObj = nextMonth.clone().date(day);
    // const date = nextMonth.date(day).format("YYYY-MM-DD");
    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber: day,
      isCurrentMonth: false,
      date: dateObj.format("YYYY-MM-DD"),
    });
  }

  return cells;
};
