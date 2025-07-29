type CalendarCell = {
  key: number;
  dayNumber: number | null;
  isCurrentMonth: boolean;
  date: string | null;
};
export const generateCalendarCells = (): CalendarCell[] => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  // محاسبه اولین روز ماه جاری
  const firstDay = new Date(year, month, 1);

  // گرفتن شماره روز هفته برای اولین روز ماه (۰ = یک‌شنبه)
  const startDay = firstDay.getDay();

  // چون می‌خواهیم تقویم از شنبه شروع شه، باید Offset اصلاح شه
  const startOffset = (startDay + 6) % 7;

  // گرفتن تعداد روزهای ماه جاری
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // کل سلول‌ها باید 42 تا باشن (6 هفته × 7 روز)
  const totalCells = 42;

  // ساخت آرایه سلول‌ها
  const calendarCells: CalendarCell[] = Array.from({ length: totalCells }, (_, index) => {
    const day = index - startOffset;
    const isCurrentMonth = day >= 1 && day <= daysInMonth;

    const date = isCurrentMonth ? new Date(year, month, day).toISOString().split("T")[0] : null;

    return {
      date,
      key: index,
      isCurrentMonth,
      dayNumber: isCurrentMonth ? day : null,
    };
  });

  return calendarCells;
};
