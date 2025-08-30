import { useTranslations } from "../hooks/useTranslations";
import { useCalendarStore } from "../store/calendarStore";

export default function CalendarLocaleSwitcher() {
  const { t } = useTranslations();
  const { locale, setLocale } = useCalendarStore();

  return (
    <div className="flex gap-2 rounded-md bg-gray-100 p-1">
      <button
        onClick={() => setLocale("fa")}
        className={`px-3 py-1 text-sm rounded-md pointer ${locale === "fa" ? "bg-white shadow" : ""}`}
      >
        {t("locales.fa")}
      </button>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 text-sm rounded-md pointer ${locale === "en" ? "bg-white shadow" : ""}`}
      >
        {t("locales.en")}
      </button>
    </div>
  );
}
