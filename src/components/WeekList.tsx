import DateObject from "react-date-object";
import { useAgendaView } from "../hooks/useAgendaView";
import { useEventStore } from "../store/eventStore";
import type { CalendarEvent } from "../types/globalTypes";
import Modal from "./modal/Modal";
import AddEventForm from "./AddEventForm";
import { useGetCalendar } from "../hooks/useGetCalendar";

const AgendaView = () => {
  const { groupedEvents } = useAgendaView();
  const eventDays = Object.keys(groupedEvents);
  const { calendar, locale } = useGetCalendar();
  const { updateEvent, deleteEvent } = useEventStore();

  console.log("groupedEvents", groupedEvents);

  if (eventDays.length === 0) {
    return <div className="p-4 text-center text-gray-500">No events in the next 7 days.</div>;
  }

  return (
    <div className="bg-transparent rounded-lg shadow">
      {eventDays.map((dayString) => {
        const dayEvents = groupedEvents[dayString];
        const dayObject = new DateObject({ date: dayString, calendar, locale });

        return (
          <div key={dayString} className="w-full">
            <div className="flex justify-between items-center border-b-2 shadow py-2 my-2 px-2 bg-[#e6e7e7ea] border-gray-300">
              <h2 className="text-md font-extrabold text-gray-700/90">{dayObject.format("dddd")}</h2>
              <p className="text-sm font-bold text-gray-700/90">{dayObject.format("MMMM DD, YYYY")}</p>
            </div>

            <ul>
              {dayEvents.map((event: CalendarEvent) => (
                <Modal key={event.id}>
                  <Modal.Open opens={event.id} stopClickPropagation>
                    <li className="flex items-center py-2 px-6 mx-2 rounded-md cursor-pointer hover:bg-[#e6e7e7ea] group">
                      <span className="w-1/4 text-sm text-gray-600 group-hover:scale-105">
                        {new DateObject(event.start).format("hh:mm A")} -{" "}
                        {new DateObject(event.end).format("hh:mm A")}
                      </span>
                      <div className="flex items-center w-3/4 group-hover:scale-105">
                        <span
                          className="w-2 h-2 rounded-full me-3"
                          style={{ backgroundColor: event.color }}
                        ></span>
                        <p className="font-semibold text-gray-800">{event.title}</p>
                      </div>
                    </li>
                  </Modal.Open>
                  <Modal.Window name={event.id}>
                    <AddEventForm
                      initialEvent={event}
                      onAdd={(updatedEvent: CalendarEvent) => updateEvent(updatedEvent)}
                      onDelete={(id: string) => deleteEvent(id)}
                    />
                  </Modal.Window>
                </Modal>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaView;
