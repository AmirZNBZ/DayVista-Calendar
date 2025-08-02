import DateObject from "react-date-object";
import { useCalendarStore } from "../store/calendarStore";
import gregorian from "react-date-object/calendars/gregorian";

export default function CalendarSwitcher() {
  console.log("new DATEOBJECT", new DateObject({calendar: gregorian}).month);

  const { calendarType, setCalendarType } = useCalendarStore();

  return (
    <div className="flex gap-2 rounded-md bg-gray-100 p-1">
      <button
        onClick={() => setCalendarType("persian")}
        className={`px-3 py-1 text-sm rounded-md ${calendarType === "persian" ? "bg-white shadow" : ""}`}
      >
        شمسی
      </button>
      <button
        onClick={() => setCalendarType("gregorian")}
        className={`px-3 py-1 text-sm rounded-md ${calendarType === "gregorian" ? "bg-white shadow" : ""}`}
      >
        میلادی
      </button>
    </div>
  );
}
