import clsx from "clsx";
import { useMemo } from "react";
import DateObject from "react-date-object";
import { useGetCalendar } from "../../hooks/useGetCalendar";
import type { CalendarEvent } from "../../types/globalTypes";
import { calculateAllDayEventLayout } from "../../utils/weekEventLayout";
import AllDaySection from "./AllDaySection";

interface WeekViewHeaderProps {
  weekDays: DateObject[];
  allDayEvents: CalendarEvent[];
  handleAllDayEventDrop: (eventId: string, newDay: DateObject) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (id: string) => void;
}

const WeekViewHeader = ({
  weekDays,
  allDayEvents,
  handleAllDayEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
}: WeekViewHeaderProps) => {
  const { calendar } = useGetCalendar();
  const timelineColumnWidth = "w-16";

  const { layoutEvents, dailyEventCounts, maxRows } = useMemo(
    () => calculateAllDayEventLayout(allDayEvents, weekDays),
    [allDayEvents, weekDays]
  );

  return (
    <header className="flex flex-none flex-col shadow z-10">
      <div className="max-w-[1247px] w-full overflow-hidden">
        {/* Day Labels */}
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

        <div className="grid grid-cols-[auto_1fr] border-t border-gray-200 min-h-20">
          <div
            className={`${timelineColumnWidth} flex items-start justify-center pt-2 border-r border-gray-200`}
          >
            <span className="text-xs font-medium text-gray-500">all-day</span>
          </div>
          <AllDaySection
            weekDays={weekDays}
            allDayEvents={allDayEvents}
            layoutEvents={layoutEvents}
            dailyEventCounts={dailyEventCounts}
            maxRows={maxRows}
            handleAllDayEventDrop={handleAllDayEventDrop}
            handleAddEvent={handleAddEvent}
            handleUpdateEvent={handleUpdateEvent}
            handleDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>
    </header>
  );
};

export default WeekViewHeader;
