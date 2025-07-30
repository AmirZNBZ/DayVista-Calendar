import { v4 as uuidv4 } from "uuid";
import type { CalendarEvent } from "../types/globalTypes";
import { useState } from "react";
import { TimePicker } from "./time-picker/TimePicker";

interface Props {
  toDate: string;
  fromDate: string;
  onAdd: (event: CalendarEvent) => void;
  initialEvent?: CalendarEvent;
  onDelete?: (id: string) => void;
}

const colors = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#a855f7", "#6b7280"];

export default function AddEventForm({ fromDate, toDate, onAdd, initialEvent, onDelete }: Props) {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [fromTime, setFromTime] = useState(initialEvent?.fromTime || "");
  const [toTime, setToTime] = useState(initialEvent?.toTime || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [color, setColor] = useState(initialEvent?.color || "#6366f1");

  const handleSubmit = () => {
    const newEvent: CalendarEvent = {
      id: initialEvent?.id || uuidv4(),
      title,
      description,
      fromDate,
      toDate,
      fromTime,
      toTime,
      color,
    };
    onAdd(newEvent);
  };

  return (
    <div className="p-4 space-y-4">
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
      <TimePicker value={fromTime} onChange={(time) => setFromTime(time)} />
      <TimePicker value={toTime} onChange={(time) => setToTime(time)} />
      <div className="flex justify-between mt-4">
        {initialEvent && onDelete && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => onDelete(initialEvent.id)}
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
