import DateObject from "react-date-object";
import type { CalendarEvent } from "../../types/globalTypes";
import DayColumn from "../weekView/DayColumn";

interface DayTimeGridProps {
  hours: number[];
  timeSlots: number[];
  day: DateObject;
  timedEvents: CalendarEvent[];
  handleDeleteEvent: (id: string) => void;
  handleAddEvent: (event: CalendarEvent) => void;
  handleUpdateEvent: (event: CalendarEvent) => void;
  handleTimedEventDrop: (eventId: string, newStartDate: DateObject) => void;
}

const TIMELINE_COLUMN_WIDTH = "w-16";

const DayTimeGrid = ({
  hours,
  timeSlots,
  day,
  timedEvents,
  handleDeleteEvent,
  handleAddEvent,
  handleUpdateEvent,
  handleTimedEventDrop,
}: DayTimeGridProps) => {
  return (
    <main className="flex-1 overflow-auto">
      <div className="relative p-0">
        <div className="relative grid grid-cols-[auto_1fr]">
          {/* Time labels column */}
          <div
            className={`border-r border-gray-200 bg-gray-50 ${TIMELINE_COLUMN_WIDTH}`}
          >
            {hours.map((hour) => (
              <div key={hour} className="h-16 relative text-xs text-gray-500">
                <div className="absolute top-0 -translate-y-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                  <span>
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

          {/* Single day column */}
          <div className="grid grid-cols-1">
            <DayColumn
              showNowIndicator
              key={day.toUnix()}
              day={day}
              timedEvents={timedEvents}
              timeSlots={timeSlots}
              handleTimedEventDrop={handleTimedEventDrop}
              handleAddEvent={handleAddEvent}
              handleUpdateEvent={handleUpdateEvent}
              handleDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DayTimeGrid;
