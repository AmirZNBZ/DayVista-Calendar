import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { CalendarEvent } from "../types/globalTypes";
import { useCalendarStore } from "../store/calendarStore";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian_en from "react-date-object/locales/gregorian_en";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";

interface Props {
  toDate?: string;
  fromDate?: string;
  onCloseModal?: () => void;
  initialEvent?: CalendarEvent;
  onDelete?: (id: string) => void;
  onAdd: (event: CalendarEvent) => void;
}

const colors = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#a855f7", "#6b7280"];

export default function AddEventForm({
  onAdd,
  toDate,
  onDelete,
  fromDate,
  onCloseModal,
  initialEvent,
}: Props) {
  const { calendarType } = useCalendarStore();

  const calendar = calendarType === "persian" ? persian : gregorian;
  const locale = calendarType === "persian" ? persian_fa : gregorian_en;

  const getInitialDate = (dateString?: string): DateObject | null => {
    if (dateString) {
      return new DateObject({ date: dateString, calendar, locale });
    }
    return null;
  };

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [color, setColor] = useState(initialEvent?.color || "#6366f1");
  const [description, setDescription] = useState(initialEvent?.description || "");

  const [fromDateTime, setFromDateTime] = useState<DateObject | null>(
    getInitialDate(initialEvent?.start || fromDate)
  );
  const [toDateTime, setToDateTime] = useState<DateObject | null>(
    getInitialDate(initialEvent?.end || toDate)
  );
  const handleSubmit = () => {
    if (!fromDateTime || !toDateTime) return;

    const newEvent: CalendarEvent = {
      color,
      title,
      description,
      id: initialEvent?.id || uuidv4(),
      // ✨ ۳. تبدیل به رشته فقط در لحظه ذخیره نهایی انجام می‌شود.
      start: fromDateTime.toDate().toISOString(),
      end: toDateTime.toDate().toISOString(),
    };
    onAdd(newEvent);
    onCloseModal?.();
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-4 space-y-4">
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="عنوان رویداد"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder="توضیحات"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">از</label>
          <DatePicker
            value={fromDateTime}
            onChange={setFromDateTime} // ✨ ۴. تابع onChange بسیار ساده شد.
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            calendar={calendar}
            locale={locale}
            inputClass="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">تا</label>
          <DatePicker
            value={toDateTime}
            onChange={setToDateTime} // ✨ ۴. تابع onChange بسیار ساده شد.
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            calendar={calendar}
            locale={locale}
            inputClass="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
      <div className="flex gap-2">
        {colors.map((c) => (
          <div
            key={c}
            className={`w-6 h-6 rounded-full cursor-pointer border-2 ${c === color ? "border-black" : "border-transparent"}`}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {initialEvent && onDelete && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => {
              onCloseModal?.();
              onDelete(initialEvent.id);
            }}
          >
            حذف
          </button>
        )}
        <button onClick={handleSubmit} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded">
          ذخیره
        </button>
      </div>
    </div>
  );
}
