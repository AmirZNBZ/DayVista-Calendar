import Header from "./Header";
import MonthView from "./MonthView";

const DayVistaCalendar = () => {
  return (
    <main className="container w-full mx-auto my-16 border border-gray-200 shadow-1xl p-2 rounded-md">
      <Header />

      <div className="my-4" />
      <MonthView />
    </main>
  );
};

export default DayVistaCalendar;
