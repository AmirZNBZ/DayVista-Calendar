import { useState, useEffect } from "react";
import IconWrapper from "../IconWrapper";
import ClockIcon from "../../icons/Clock";
import { useOutsideClick } from "../../hooks/useOutSideClick";

interface TimePickerProps {
  value: string;
  className?: string;
  onChange: (time: string) => void;
}

export const TimePicker = ({ value, onChange, className }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // جدا کردن ساعت و دقیقه از پراپ ورودی
  const [hour, setHour] = useState(() => parseInt(value.split(":")[0] || "0", 10));
  const [minute, setMinute] = useState(() => parseInt(value.split(":")[1] || "0", 10));

  const pickerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  // آپدیت کردن ساعت و دقیقه داخلی اگر پراپ `value` از بیرون تغییر کرد
  useEffect(() => {
    const [h, m] = value.split(":").map(Number);
    if (!isNaN(h)) setHour(h);
    if (!isNaN(m)) setMinute(m);
  }, [value]);

  // تابع برای تایید نهایی و ارسال به والد
  const handleSetTime = () => {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    onChange(`${formattedHour}:${formattedMinute}`);
    setIsOpen(false);
  };

  const handleReset = () => {
    setHour(() => parseInt(value.split(":")[0] || "0", 10));
    setMinute(() => parseInt(value.split(":")[1] || "0", 10));
  };

  // آرایه‌های ساعت و دقیقه برای نمایش
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div ref={pickerRef} className={`relative w-full max-w-xs ${className}`}>
      {/* Input برای نمایش زمان */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <IconWrapper>
            <ClockIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </IconWrapper>
        </span>
      </div>

      {/* پنل انتخابگر زمان */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
          <div className="flex h-48">
            {/* ستون ساعت */}
            <div className="flex-1 overflow-y-auto border-r border-gray-200">
              {hours.map((h) => (
                <div
                  key={h}
                  onClick={() => setHour(h)}
                  className={`flex cursor-pointer items-center justify-center p-2 text-sm hover:bg-gray-100 ${
                    hour === h ? "bg-indigo-500 font-bold text-white" : "text-gray-900"
                  }`}
                >
                  {String(h).padStart(2, "0")}
                </div>
              ))}
            </div>

            {/* ستون دقیقه */}
            <div className="flex-1 overflow-y-auto">
              {minutes.map((m) => (
                <div
                  key={m}
                  onClick={() => setMinute(m)}
                  className={`flex cursor-pointer items-center justify-center p-2 text-sm hover:bg-gray-100 ${
                    minute === m ? "bg-indigo-500 font-bold text-white" : "text-gray-900"
                  }`}
                >
                  {String(m).padStart(2, "0")}
                </div>
              ))}
            </div>
          </div>

          <div className="flex border-t border-gray-200 bg-gray-50 p-2">
            <button
              onClick={handleReset}
              className="w-full mr-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              بازنشانی
            </button>
            <button
              onClick={handleSetTime}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
