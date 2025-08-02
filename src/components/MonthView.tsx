import clsx from "clsx";
import { daysOfWeekEn, daysOfWeekFa } from "../constants";
import { useGenerateCalendarCells } from "../hooks/useCalendarCells";
import { useEventStore } from "../store/eventStore";
import AddEventForm from "./AddEventForm";
import Modal from "./modal/Modal";
import React from "react";
import type { CalendarEvent } from "../types/globalTypes";
import { useCalendarStore } from "../store/calendarStore";

const MonthView = () => {
  const eventStore = useEventStore();
  const { calendarType } = useCalendarStore();
  const generatedDate = useGenerateCalendarCells();

  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    generatedDate.slice(rowIndex * 7, rowIndex * 7 + 7)
  );

  const updateEvent = (event: CalendarEvent) => {
    eventStore.updateEvent(event);
  };
  const addEvent = (event: CalendarEvent) => {
    eventStore.addEvent(event);
  };
  const deleteEvent = (id: CalendarEvent["id"]) => {
    eventStore.deleteEvent(id);
  };

  const daysOfWeek = calendarType === "persian" ? daysOfWeekFa : daysOfWeekEn;

  // console.log("rows", rows);
  // console.log("events", eventStore.events);

  return (
    <Modal>
      <table className="w-full h-full table-fixed">
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
                      // thats data attr so important for using the modal
                      data-no-outside-click
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
                        <ul onClick={(e) => e.stopPropagation()} className="mt-1 space-y-1 text-xs text-left">
                          {eventStore.events
                            .filter((ev: CalendarEvent) => ev.fromDate === date)
                            .map((ev: CalendarEvent) => (
                              <React.Fragment key={ev.id}>
                                <Modal.Open opens={ev.id} stopClickPropagation={true}>
                                  <li
                                    key={ev.id}
                                    data-no-outside-click
                                    className="overflow-hidden text-ellipsis whitespace-nowrap rounded px-1 text-sm text-white"
                                    style={{ backgroundColor: ev.color }}
                                  >
                                    <span className="font-bold">
                                      {ev.fromDate}-{ev.fromTime} to {ev.toDate}-{ev.toTime}
                                    </span>
                                    - {ev.title}
                                  </li>
                                </Modal.Open>
                                <Modal.Window name={ev.id}>
                                  <AddEventForm
                                    initialEvent={ev}
                                    toDate={ev.toDate}
                                    onAdd={updateEvent}
                                    fromDate={ev.fromDate}
                                    onDelete={deleteEvent}
                                  />
                                </Modal.Window>
                              </React.Fragment>
                            ))}
                        </ul>
                      </div>
                    </td>
                  </Modal.Open>
                  <Modal.Window name={key.toString()}>
                    <AddEventForm fromDate={date || ""} toDate={date || ""} onAdd={addEvent} />
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
