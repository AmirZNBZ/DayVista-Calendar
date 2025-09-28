import clsx from "clsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TrashIcon from "../icons/Trash";
import IconWrapper from "./IconWrapper";
import { useGetCalendar } from "../hooks/useGetCalendar";
import type { CalendarEvent } from "../types/globalTypes";
import { getDayBoundary } from "../helpers/getDayBoundary";
import DatePicker, { DateObject } from "react-multi-date-picker";
import AnalogTimePicker from "react-multi-date-picker/plugins/analog_time_picker";
import { useTranslations } from "../hooks/useTranslations";

interface Props {
  toDate?: DateObject;
  fromDate?: DateObject;
  onCloseModal?: () => void;
  initialEvent?: CalendarEvent;
  onDelete?: (id: string) => void;
  onAdd: (event: CalendarEvent) => void;
}

const colors = [
  "#6366f1",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#a855f7",
  "#6b7280",
];

export default function AddEventForm({
  onAdd,
  toDate,
  onDelete,
  fromDate,
  onCloseModal,
  initialEvent,
}: Props) {
  const { t } = useTranslations();
  const { calendar, locale } = useGetCalendar();
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [color, setColor] = useState(initialEvent?.color || "#6366f1");
  const [allDayChecked, setAllDayChecked] = useState(
    initialEvent?.allDay || false
  );
  const [description, setDescription] = useState(
    initialEvent?.description || ""
  );

  const [fromDateTime, setFromDateTime] = useState<DateObject | null>(
    initialEvent
      ? new DateObject({ date: initialEvent.start, calendar, locale })
      : fromDate || null
  );
  const [toDateTime, setToDateTime] = useState<DateObject | null>(
    initialEvent
      ? new DateObject({ date: initialEvent.end, calendar, locale })
      : toDate || null
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
      start: fromDateTime,
      end: toDateTime,
    };
    onAdd(newEvent);
    onCloseModal?.();
  };

  const handleCheckAllDay = () => {
    setAllDayChecked((prevIsChecked) => {
      const isNowChecked = !prevIsChecked;

      if (isNowChecked) {
        if (fromDateTime) {
          const startOfDay = getDayBoundary(fromDateTime, "start");
          const endOfDay = getDayBoundary(fromDateTime, "end");
          setFromDateTime(startOfDay);
          setToDateTime(endOfDay);
        }
      } else {
        setToDateTime(toDate || new DateObject());
        setFromDateTime(fromDate || new DateObject());
      }

      return isNowChecked;
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-4 space-y-4">
      <label
        htmlFor="title"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {t("eventTitle")}
      </label>
      <input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder={`${t("eventTitle")}`}
      />
      <label
        htmlFor="description"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {t("description")}
      </label>
      <textarea
        id="description"
        className="w-full border rounded px-3 py-2"
        placeholder={t("description")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("from")}
          </label>
          <DatePicker
            locale={locale}
            calendar={calendar}
            value={fromDateTime}
            disabled={allDayChecked}
            onChange={setFromDateTime}
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass={clsx(
              allDayChecked ? "bg-gray-400" : "",
              "w-full border rounded px-3 py-2"
            )}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("to")}
          </label>
          <DatePicker
            locale={locale}
            value={toDateTime}
            calendar={calendar}
            disabled={allDayChecked}
            onChange={setToDateTime}
            format="YYYY/MM/DD - HH:mm"
            calendarPosition="bottom-right"
            plugins={[<AnalogTimePicker hideSeconds />]}
            inputClass={clsx(
              allDayChecked ? "bg-gray-400" : "",
              "w-full border rounded px-3 py-2"
            )}
          />
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <label htmlFor="allDaySwitch" className="text-md font-semibold">
          {t("allDay")}
        </label>
        <label className="switch">
          <input
            type="checkbox"
            id="allDaySwitch"
            checked={allDayChecked}
            onChange={handleCheckAllDay}
          />
          <span className="slider"></span>
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
        <div className="flex gap-4 self-end">
          <button
            onClick={onCloseModal}
            className="ml-auto px-4 mx-1 py-2 bg-blue-600/80 hover:bg-blue-900/90 text-white rounded"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="ml-auto px-4 py-2 bg-blue-600/80 hover:bg-blue-900/90 text-white rounded"
          >
            {onDelete ? t("update") : t("add")}
          </button>
        </div>
      </div>
    </div>
  );
}
