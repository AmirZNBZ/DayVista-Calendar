import DateObject from "react-date-object";
import type { CalendarEvent } from "../../types/globalTypes";
import DayColumn from "./DayColumn";

interface TimeGridProps {
  hours: number[];
  timeSlots: number[];
  weekDays: DateObject[];
  timedEvents: CalendarEvent[];
  handleDeleteEvent: (id: string) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleTimedEventDrop: (eventId: string, newStartDate: DateObject) => void;
}
const TIMELINE_COLUMN_WIDTH = "w-16";

const TimeGrid = ({
  hours,
  weekDays,
  timedEvents,
  timeSlots,
  handleTimedEventDrop,
  handleAddEvent,
  handleUpdateEvent,
  handleDeleteEvent,
}: TimeGridProps) => {
  return (
    <main className="flex-auto overflow-auto">
      <div className="max-w-[1247px] w-full overflow-hidden">
        <div className="relative grid grid-cols-[auto_1fr]">
          <div className={`${TIMELINE_COLUMN_WIDTH} grid grid-rows-24`}>
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
                  <span className="flex-1"></span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {weekDays.map((day) => (
              <DayColumn
                key={day.toUnix()}
                day={day}
                timedEvents={timedEvents}
                timeSlots={timeSlots}
                handleTimedEventDrop={handleTimedEventDrop}
                handleAddEvent={handleAddEvent}
                handleUpdateEvent={handleUpdateEvent}
                handleDeleteEvent={handleDeleteEvent}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TimeGrid;
