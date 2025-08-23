import Header from "./Header";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { useEventStore } from "../store/eventStore";
import { useCalendarStore } from "../store/calendarStore";

const DayVistaCalendar = () => {
  const { events } = useEventStore();
  const { viewType } = useCalendarStore();
  console.log("events:", events);
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
