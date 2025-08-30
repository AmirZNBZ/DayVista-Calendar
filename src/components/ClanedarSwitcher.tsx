import { useTranslations } from "../hooks/useTranslations";
import { useCalendarStore } from "../store/calendarStore";

export default function CalendarSwitcher() {
  const { t } = useTranslations();
  const { calendarType, setCalendarType } = useCalendarStore();

  return (
    <div className="flex gap-2 rounded-md bg-gray-100 p-1">
      <button
        onClick={() => setCalendarType("persian")}
        className={`px-3 py-1 text-sm rounded-md pointer ${calendarType === "persian" ? "bg-white shadow" : ""}`}
      >
        {t("calendarType.persian")}
      </button>
      <button
        onClick={() => setCalendarType("gregorian")}
        className={`px-3 py-1 text-sm rounded-md pointer ${calendarType === "gregorian" ? "bg-white shadow" : ""}`}
      >
        {t("calendarType.gregorian")}
      </button>
    </div>
  );
}
