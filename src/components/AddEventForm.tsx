import clsx from "clsx";
import { useState } from "react";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker, { DateObject } from "react-multi-date-picker";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";
import { v4 as uuidv4 } from "uuid";
import TrashIcon from "../icons/Trash";
import { useCalendarStore } from "../store/calendarStore";
import type { CalendarEvent } from "../types/globalTypes";
import IconWrapper from "./IconWrapper";

interface Props {
  toDate?: DateObject;
  fromDate?: DateObject;
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

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [color, setColor] = useState(initialEvent?.color || "#6366f1");
  const [allDayChecked, setAllDayChecked] = useState(initialEvent?.allDay || false);
  const [description, setDescription] = useState(initialEvent?.description || "");

  console.log("fromDate", fromDate);
  console.log("toDate", toDate);

  const [fromDateTime, setFromDateTime] = useState<DateObject | null>(
    initialEvent ? new DateObject({ date: initialEvent.start, calendar, locale }) : fromDate || null
  );
  const [toDateTime, setToDateTime] = useState<DateObject | null>(
    initialEvent ? new DateObject({ date: initialEvent.end, calendar, locale }) : toDate || null
  );

  const handleSubmit = () => {
    if (!fromDateTime || !toDateTime) return;

    const newEvent: CalendarEvent = {
      color,
      title,
      description,
      allDay: allDayChecked,
      id: initialEvent?.id || uuidv4(),
      // ✨ ۳. تبدیل به رشته فقط در لحظه ذخیره نهایی انجام می‌شود.
      start: fromDateTime.toDate().toISOString(),
      end: toDateTime.toDate().toISOString(),
    };
    onAdd(newEvent);
    onCloseModal?.();
  };

  const handleCheckAllDay = () => {
    setAllDayChecked((prevIsChecked) => {
      const isNowChecked = !prevIsChecked;

      if (isNowChecked) {
        if (fromDateTime) {
          const endOfDay = new DateObject(fromDateTime).set("hour", 23).set("minute", 59).set("second", 59);

          setToDateTime(endOfDay);
        }
      } else {
        setToDateTime(toDate || null);
        setFromDateTime(fromDate || null);
      }

      return isNowChecked;
    });
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
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <DatePicker
            locale={locale}
            calendar={calendar}
            value={fromDateTime}
            disabled={allDayChecked}
            onChange={setFromDateTime}
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass={clsx(allDayChecked ? "bg-gray-400" : "", "w-full border rounded px-3 py-2")}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <DatePicker
            locale={locale}
            value={toDateTime}
            calendar={calendar}
            disabled={allDayChecked}
            onChange={setToDateTime}
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass={clsx(allDayChecked ? "bg-gray-400" : "", "w-full border rounded px-3 py-2")}
          />
        </div>
      </div>
      <div className="flex items-center">
        <label className="switch">
          <input type="checkbox" id="allDaySwitch" checked={allDayChecked} onChange={handleCheckAllDay} />
          <span className="slider"></span>
        </label>
        <label htmlFor="allDaySwitch" className="ml-2">
          All Day
        </label>
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
      <div
        className={clsx(
          initialEvent && onDelete ? "justify-between" : "justify-end",
          "flex items-center mt-4"
        )}
      >
        {initialEvent && onDelete && (
          <IconWrapper
            onClickFn={() => onDelete(initialEvent.id)}
            className="pointer hover:bg-gray-100 w-10 h-10 rounded-full items-center flex justify-center hover:transition-colors hover:duration-300 hover:ease-in-out"
          >
            <TrashIcon fill="red" />
          </IconWrapper>
        )}
        <div className="self-end">
          <button
            onClick={onCloseModal}
            className="ml-auto px-4 mx-1 py-2 bg-blue-600/80 hover:bg-blue-900/90 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="ml-auto px-4 py-2 bg-blue-600/80 hover:bg-blue-900/90 text-white rounded"
          >
            {onDelete ? "UPDATE" : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );
}
