import DateObject from "react-date-object";
import { useCalendarStore } from "../store/calendarStore";

// تعریف تایپ برای هر خانه از تقویم
interface CalendarCell {
  key: number | string;
  dayNumber: number;
  isCurrentMonth: boolean;
  date: DateObject; // فرمت YYYY-MM-DD
}

export const useGenerateCalendarCells = (): CalendarCell[] => {
  const { viewDate } = useCalendarStore();

  const cells: CalendarCell[] = [];
  const totalCells = 42; // 6 هفته * 7 روز

  // 2. محاسبه اطلاعات اصلی ماه جاری
  const startOfMonth = new DateObject(viewDate.toFirstOfMonth());
  const daysInMonth = viewDate.month.length;
  const startDayOfWeek = startOfMonth.weekDay.index; // 0 (Sunday) تا 6 (Saturday)

  // 3. پر کردن روزهای ماه قبل
  const prevMonth = new DateObject(startOfMonth).subtract(1, "month");
  const prevMonthDays = prevMonth.month.length;

  for (let i = 0; i < startDayOfWeek; i++) {
    const dayNumber = prevMonthDays - startDayOfWeek + 1 + i;
    const dateObj = new DateObject(prevMonth).set("day", dayNumber);

    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber,
      isCurrentMonth: false,
      date: dateObj,
    });
  }

  // 4. پر کردن روزهای ماه جاری
  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
    const dateObj = new DateObject(startOfMonth).set("day", dayNumber);
    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber,
      isCurrentMonth: true,
      date: dateObj,
    });
  }

  // 5. پر کردن روزهای ماه بعد
  const remainingCells = totalCells - cells.length;
  const nextMonth = new DateObject(startOfMonth).add(1, "month");

  for (let dayNumber = 1; dayNumber <= remainingCells; dayNumber++) {
    const dateObj = new DateObject(nextMonth).set("day", dayNumber);

    cells.push({
      key: dateObj.format("YYYY-MM-DD"),
      dayNumber,
      isCurrentMonth: false,
      date: dateObj,
    });
  }

  return cells;
};
