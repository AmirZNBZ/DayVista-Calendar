import clsx from "clsx";
import { daysOfWeek } from "../constants";
import { generateCalendarCells } from "../hooks/useCalendarCells";
import { useEventStore } from "../store/eventStore";
import AddEventForm from "./AddEventForm";
import Modal from "./modal/Modal";
import React, { useState } from "react";

interface MonthViewProps {
  year: number;
  month: number;
}

const MonthView = ({ year, month }: MonthViewProps) => {
  const generatedDate = generateCalendarCells(year, month);
  const [eventId, setEventId] = useState<string>("");
  const eventStore = useEventStore();

  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    generatedDate.slice(rowIndex * 7, rowIndex * 7 + 7)
  );

  console.log("rows", rows);
  console.log("events", eventStore.events);

  return (
    <Modal>
      <table className="w-full h-full">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((week, rowIdx) => (
            <tr key={rowIdx}>
              {week.map(({ dayNumber, date, isCurrentMonth, key }) => (
                <React.Fragment key={key}>
                  <Modal.Open opens={key.toString()} key={key}>
                    <td
                      key={key}
                      className={clsx(
                        "active:bg-purple-200/20 select-none min-h-20 h-20 p-1 align-top border border-orange-400"
                      )}
                    >
                      <div className="relative">
                        <div className="text-right">
                          {dayNumber && (
                            <strong className={clsx(!isCurrentMonth ? "text-gray-300" : "")}>
                              {dayNumber}
                            </strong>
                          )}
                        </div>
                        <ul className="mt-1 space-y-1 text-xs text-left">
                          {eventStore.events
                            .filter((ev) => ev.fromDate === date)
                            .map((ev) => (
                              <li
                                key={ev.id}
                                onClick={() => setEventId(eventId)}
                                className="overflow-hidden text-ellipsis whitespace-nowrap rounded px-1 text-sm text-white"
                                style={{ backgroundColor: ev.color }}
                              >
                                <span className="font-bold">
                                  {ev.fromDate}-{ev.fromTime} to {ev.toDate}-{ev.toTime}
                                </span>
                                - {ev.title}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </td>
                  </Modal.Open>
                  <Modal.Window name={key.toString()}>
                    <AddEventForm
                      fromDate={date || ""}
                      toDate={date || ""}
                      onAdd={(event) => eventStore.addEvent(event)}
                      onDelete={(id) => eventStore.deleteEvent(id)}
                    />
                  </Modal.Window>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default MonthView;
