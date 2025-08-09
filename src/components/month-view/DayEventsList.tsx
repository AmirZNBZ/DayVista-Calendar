import Modal from "../modal/Modal";
import EditEvent from "./EditEvent";
import DateObject from "react-date-object";
import type { Calendar, Locale } from "react-date-object";
import type { EventSegment } from "../../types/globalTypes";

interface DayEventsListProps {
  date: DateObject;
  locale: Locale;
  events: EventSegment[];
  calendar: Omit<Calendar, "leapsLength">;
}

const MAX_EVENTS_VISIBLE = 3;

const DayEventsList = ({ calendar, date, events, locale }: DayEventsListProps) => {
  const sortedEvents = [...events].sort((a, b) => a.level - b.level);

  const eventsInView = sortedEvents.filter((segment) => segment.level < MAX_EVENTS_VISIBLE);

  const visibleEvents = eventsInView.slice(0, MAX_EVENTS_VISIBLE - 1);
  const hasMoreLink = sortedEvents.length > MAX_EVENTS_VISIBLE;

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className="mt-1 space-y-1 text-xs text-left">
        {(hasMoreLink ? visibleEvents : eventsInView).map((segment) => (
          <EditEvent
            key={`${segment.id}-${date}`}
            event={segment}
            isStart={segment.isStart}
            isEnd={segment.isEnd}
            topPosition={segment.level * 24}
          />
        ))}
        {hasMoreLink && (
          <Modal.Open stopClickPropagation={true} opens={`more-events-${date}`}>
            <p className="absolute bottom-0 text-xs font-bold text-gray-600 hover:underline cursor-pointer">
              +{sortedEvents.length - (MAX_EVENTS_VISIBLE - 1)} more
            </p>
          </Modal.Open>
        )}
      </div>
      {hasMoreLink && (
        <Modal.Window name={`more-events-${date}`}>
          <Modal>
            <div className="p-4">
              <h3 className="font-bold mb-4">
                رویدادهای روز {new DateObject({ date, calendar, locale }).format("DD MMMM YYYY")}
              </h3>
              <ul className="space-y-2">
                {sortedEvents.map((ev) => {
                  const isMultiDay =
                    new DateObject(ev.start).format("YYYY-MM-DD") !==
                    new DateObject(ev.end).format("YYYY-MM-DD");

                  return <EditEvent event={ev} key={ev.id} viewMode="list" isMultiDay={isMultiDay} />;
                })}
              </ul>
            </div>
          </Modal>
        </Modal.Window>
      )}
    </>
  );
};

export default DayEventsList;
