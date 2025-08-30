import { useCalendarStore } from "../store/calendarStore";

export default function CalendarSwitcher() {
  const { calendarType, setCalendarType } = useCalendarStore();

  return (
    <div className="flex gap-2 rounded-md bg-gray-100 p-1">
      <button
        onClick={() => setCalendarType("persian")}
        className={`px-3 py-1 text-sm rounded-md pointer ${calendarType === "persian" ? "bg-white shadow" : ""}`}
      >
        شمسی
      </button>
      <button
        onClick={() => setCalendarType("gregorian")}
        className={`px-3 py-1 text-sm rounded-md pointer ${calendarType === "gregorian" ? "bg-white shadow" : ""}`}
      >
        میلادی
      </button>
    </div>
  );
}
