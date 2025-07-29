import { useState } from "react";
import Header from "./Header";
import MonthView from "./MonthView";

const DayVistaCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  return (
    <main className="container w-full mx-auto my-16 border border-gray-200 shadow-1xl p-2 rounded-md">
      <Header monthIncrease={setMonth} yearIncrease={setYear} month={month} year={year} />
      <div className="border-b border-b-gray-300 my-1" />
      <MonthView month={month} year={year} />
    </main>
  );
};

export default DayVistaCalendar;
