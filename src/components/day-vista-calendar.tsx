import Header from "./Header";
import DayView from "./DayView";
import WeekList from "./WeekList";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { useEventStore } from "../store/eventStore";
import { useCalendarStore } from "../store/calendarStore";

const DayVistaCalendar = () => {
  const { events } = useEventStore();
  const { viewType } = useCalendarStore();
  console.log("events:", events);
  return (
    <main className="max-w-7xl w-full mx-auto my-14 bg-[#fffbfbf8]">
      <div className="mx-2 border border-gray-200 shadow-1xl rounded-md">
        <Header />
        {viewType === "Month" && <MonthView />}
        {viewType === "Week" && <WeekView />}
        {viewType === "Day" && <DayView />}
        {viewType === "WeekList" && <WeekList />}
      </div>
    </main>
  );
};

export default DayVistaCalendar;
