import { useCalendarStore } from "../store/calendarStore";
import Header from "./Header";
import MonthView from "./MonthView";
import WeekView from "./WeekView";

const DayVistaCalendar = () => {
  const { viewType } = useCalendarStore();
  return (
    <main className="max-w-7xl w-full mx-auto my-16">
      <div className="mx-2 border border-gray-200 shadow-1xl rounded-md">
        <Header />
        {viewType === "Month" && <MonthView />}
        {viewType === "Week" && <WeekView />}
      </div>
    </main>
  );
};

export default DayVistaCalendar;
