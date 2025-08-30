import { useMemo } from "react";
import DateObject from "react-date-object";
import { useCalendarStore } from "../store/calendarStore";

export const useGetDate = () => {
  const viewDate = useCalendarStore((state) => state.viewDate);
  const ViewType = useCalendarStore((state) => state.viewType);
  const calendarType = useCalendarStore((state) => state.calendarType);

  return useMemo(() => {
    const getDateFormat = {
      Month: () => viewDate.format(calendarType === "gregorian" ? "MMMM YYYY" : "YYYY - MMMM"),
      Day: () => viewDate.format(calendarType === "gregorian" ? "DD MMM, YYYY" : "D MMMM YYYY"),
      Week: () => {
        const weekDayIndex = viewDate.weekDay.index;
        const startOfWeek = new DateObject(viewDate).subtract(weekDayIndex, "days");
        const endOfWeek = new DateObject(startOfWeek).add(6, "days");

        const startYear = startOfWeek.format("YYYY");
        const endYear = endOfWeek.format("YYYY");

        const startMonth = startOfWeek.format(calendarType === "gregorian" ? "MMM" : "MMMM");
        const endMonth = endOfWeek.format(calendarType === "gregorian" ? "MMM" : "MMMM");

        if (startYear !== endYear) {
          return `${startOfWeek.format("MMM DD, YYYY")} - ${endOfWeek.format("MMM DD, YYYY")}`;
        }
        if (startMonth !== endMonth) {
          return `${startOfWeek.format("MMM DD")} - ${endOfWeek.format("MMM DD, YYYY")}`;
        }
        return `${startOfWeek.format(calendarType === "gregorian" ? "MMM DD" : "DD")} - ${endOfWeek.format("DD, YYYY")}`;
      },
      WeekList: () => getDateFormat.Week(),
    };

    return getDateFormat[ViewType]();
  }, [calendarType, ViewType, viewDate]);
};
