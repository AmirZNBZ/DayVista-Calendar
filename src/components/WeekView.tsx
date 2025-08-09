import clsx from "clsx";
import Modal from "./modal/Modal";
import React from "react";
import AddEventForm from "./AddEventForm";
import DateObject from "react-date-object";
import { useWeekView } from "../hooks/useWeekView";
import { useGetCalendar } from "../hooks/useGetCalendar";

const WeekView = () => {
  const { weekDays, timeSlots, hours, addEvent } = useWeekView();
  const { calendar } = useGetCalendar();

  console.log(calendar);

  //عرض ستون تایم لاین که باید در همه جا یکسان باشد
  const timelineColumnWidth = "w-16";

  return (
    <Modal>
      <div className="flex flex-col h-[85vh] bg-white text-gray-700">
        <header className="flex flex-none flex-col shadow z-10">
          <div className="w-[1247px] overflow-hidden">
            <div className="grid grid-cols-[auto_1fr]">
              <div className={clsx(`${timelineColumnWidth} border-r border-gray-200`)}></div>
              <div className="grid grid-cols-7">
                {weekDays.map((day) => (
                  <div key={day.toUnix()} className="flex-1 p-2 text-center border-l border-gray-200">
                    <p className="text-2xl font-medium">
                      {calendar.name === "gregorian" ? day.format("DD/MMM") : day.format("DD/MMMM")}
                    </p>
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
                  <div key={day.toUnix()} className="relative border-l border-gray-200 p-1"></div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-auto overflow-auto">
          <div className="w-[1247px] overflow-hidden">
            <div className="relative grid grid-cols-[auto_1fr]">
              <div className={`${timelineColumnWidth} grid grid-rows-24`}>
                {hours.map((hour) => (
                  <div key={hour} className="h-16 relative flex justify-end pr-2">
                    <div className="flex flex-col text-xs text-gray-500">
                      <span className="flex-1 place-content-center">
                        {hour === 0
                          ? "12 AM"
                          : hour < 12
                            ? `${hour} AM`
                            : hour === 12
                              ? "12 PM"
                              : `${hour - 12} PM`}
                      </span>
                      {/* for centering the hour of columns */}
                      <span className="flex-1"></span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {weekDays.map((day) => (
                  <div key={day.toUnix()} className="relative grid grid-rows-48 border-l border-gray-200">
                    {timeSlots.map((slotIndex) => {
                      const hour = Math.floor(slotIndex / 2);
                      const minute = (slotIndex % 2) * 30;
                      const fromDateObj = new DateObject(day).set({ hour, minute, second: 0 });
                      const toDateObj = new DateObject(fromDateObj).add(30, "minutes");
                      const isHalfHour = slotIndex % 2 !== 0;
                      const modalId = `${day.toUnix()}-${slotIndex}`;
                      return (
                        <React.Fragment key={modalId}>
                          <Modal.Open stopClickPropagation opens={modalId}>
                            <div
                              className={clsx(
                                "h-8 hover:bg-amber-500/10 cursor-pointer group",
                                !isHalfHour && "border-t border-gray-200"
                              )}
                            >
                              {isHalfHour && <div className="border-t border-dashed border-gray-300"></div>}
                            </div>
                          </Modal.Open>
                          <Modal.Window name={modalId}>
                            <AddEventForm onAdd={addEvent} toDate={toDateObj} fromDate={fromDateObj} />
                          </Modal.Window>
                        </React.Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Modal>
  );
};

export default WeekView;
