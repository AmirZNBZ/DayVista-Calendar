import Modal from "./modal/Modal";
import CalendarCell from "./CalendarCell";
import { useMonthView } from "../hooks/useMonthView";
import { useTranslations } from "../hooks/useTranslations";

const MonthView = () => {
  const { t } = useTranslations();
  const { rows, locale, addEvent, calendar, weekDays, eventLayout, handleEventDrop } = useMonthView();

  console.log("rows", rows);

  return (
    <Modal>
      <table className="w-full h-full table-fixed">
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day} className="p-2">
                {t(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((week, rowIdx) => (
            <tr key={rowIdx}>
              {week.map((cell) => {
                const eventsForThisDay = eventLayout.get(cell.date.format("YYYY-MM-DD")) || [];

                return (
                  <CalendarCell
                    key={cell.key}
                    locale={locale}
                    cellData={cell}
                    calendar={calendar}
                    onAddEvent={addEvent}
                    events={eventsForThisDay}
                    onEventDrop={handleEventDrop}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default MonthView;
