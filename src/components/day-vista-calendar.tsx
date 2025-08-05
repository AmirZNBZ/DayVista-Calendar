import Header from "./Header";
import MonthView from "./MonthView";

const DayVistaCalendar = () => {
  return (
    <main className="max-w-7xl w-full mx-auto my-16">
      <div className="mx-2 border border-gray-200 shadow-1xl rounded-md">
        <Header />
        <MonthView />
      </div>
    </main>
  );
};

export default DayVistaCalendar;
