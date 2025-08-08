import { useMemo } from "react";
import DateObject from "react-date-object";
import clsx from "clsx";

const useSimplifiedWeekView = () => {
  const viewDate = useMemo(() => new DateObject(), []);
  const weekDays = useMemo(() => {
    const startOfWeek = viewDate.toFirstOfWeek();
    return Array.from({ length: 7 }).map((_, i) => new DateObject(startOfWeek).add(i, "day"));
  }, [viewDate]);

  const timeSlots = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  return { weekDays, timeSlots, hours, locale: "en" };
};

const WeekView = () => {
  const { weekDays, timeSlots, hours } = useSimplifiedWeekView();

  const handleSlotClick = (day: DateObject, slotIndex: number) => {
    const hour = Math.floor(slotIndex / 2);
    const minute = (slotIndex % 2) * 30;
    const clickedDateTime = new DateObject(day).set({ hour, minute, second: 0 });
    console.log(`Slot Clicked: ${clickedDateTime.format("YYYY/MM/DD HH:mm")}`);
  };

  // عرض ستون تایم لاین که باید در همه جا یکسان باشد
  const timelineColumnWidth = "w-16";

  return (
    <div className="flex flex-col h-[90vh] bg-white text-gray-700">

      <header className="flex flex-none flex-col shadow z-10">
        <div className="grid grid-cols-[auto_1fr]">
          <div className={`${timelineColumnWidth} border-r border-gray-200`}></div>
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day.toUnix()} className="flex-1 p-2 text-center border-l border-gray-200">
                <p className="text-2xl font-medium">{day.format("DD/MMMM")}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] border-t border-gray-200">
          <div
            className={`${timelineColumnWidth} flex items-start justify-center pt-2 border-r border-gray-200`}
          >
            <span className="text-xs font-medium text-gray-500">all-day</span>
          </div>
          <div className="grid grid-cols-7 min-h-[34px]">
            {weekDays.map((day) => (
              <div key={day.toUnix()} className="relative border-l border-gray-200 p-1">
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-auto overflow-auto scrollbar-gutter">
        <div className="relative grid grid-cols-[auto_1fr]">
          <div className={`${timelineColumnWidth} grid grid-rows-24`}>
            {hours.map((hour) => (
              <div key={hour} className="h-16 relative flex justify-end pr-2">
                <span className="text-xs text-gray-500 -translate-y-1/2">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <div key={day.toUnix()} className="relative grid grid-rows-48 border-l border-gray-200">
                {timeSlots.map((slotIndex) => {
                  const isHalfHour = slotIndex % 2 !== 0;
                  return (
                    <div
                      key={slotIndex}
                      onClick={() => handleSlotClick(day, slotIndex)}
                      className={clsx(
                        "h-8 cursor-pointer group",
                        !isHalfHour && "border-t border-gray-200"
                      )}
                    >
                      {isHalfHour && <div className="border-t border-dashed border-gray-200"></div>}
                      <div className="hidden group-hover:block absolute bg-sky-100/50 inset-0 -ml-px"></div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeekView;
