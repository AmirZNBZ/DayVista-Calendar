import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import type { CalendarEvent } from "../types/globalTypes";
import DatePicker, { DateObject } from "react-multi-date-picker";
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

const createDateObject = (dateStr?: string, timeStr?: string): Date | null => {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr} ${timeStr}`);
};

export default function AddEventForm({
  onAdd,
  toDate,
  onDelete,
  fromDate,
  onCloseModal,
  initialEvent,
}: Props) {

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [color, setColor] = useState(initialEvent?.color || "#6366f1");
  const [description, setDescription] = useState(initialEvent?.description || "");

  const [fromDateTime, setFromDateTime] = useState<Date | null>(
    createDateObject(initialEvent?.fromDate, initialEvent?.fromTime) || createDateObject(fromDate, "00:00")
  );
  const [toDateTime, setToDateTime] = useState<Date | null>(
    createDateObject(initialEvent?.toDate, initialEvent?.toTime) || createDateObject(toDate, "00:00")
  );

  const handleSubmit = () => {
    // ✨ ۳. تفکیک تاریخ و زمان قبل از ذخیره
    if (!fromDateTime || !toDateTime) return; // جلوگیری از ذخیره در صورت خالی بودن

    const fromDateObject = new DateObject(fromDateTime);
    const toDateObject = new DateObject(toDateTime);
    
    const newEvent: CalendarEvent = {
      color,
      title,
      description,
      id: initialEvent?.id || uuidv4(),
      toTime: toDateObject.format("HH:mm"),
      fromTime: fromDateObject.format("HH:mm"),
      toDate: toDateObject.format("YYYY-MM-DD"),
      fromDate: fromDateObject.format("YYYY-MM-DD"),
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
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass="w-full border rounded px-3 py-2"
            onChange={(date: DateObject | null) => {
              if (date) setFromDateTime(date.toDate());
              else setFromDateTime(null);
            }}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">تا</label>
          <DatePicker
            value={toDateTime}
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass="w-full border rounded px-3 py-2"
            onChange={(date: DateObject | null) => {
              if (date) setToDateTime(date.toDate());
              else setToDateTime(null);
            }}
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
