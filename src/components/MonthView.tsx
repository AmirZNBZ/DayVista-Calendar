import clsx from "clsx";
import { daysOfWeek } from "../constants";
import { useCalendarCells } from "../hooks/useCalendarCells";

interface MonthViewProps {
  year: number;
  month: number;
}

const MonthView = ({ year, month }: MonthViewProps) => {
  const generatedDate = useCalendarCells(year, month);

  const rows = Array.from({ length: 6 }, (_, rowIndex) =>
    generatedDate.slice(rowIndex * 7, rowIndex * 7 + 7)
  );
  return (
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
            {week.map(({ dayNumber, isCurrentMonth, key }) => (
              <td
                key={key}
                className={clsx(
                  isCurrentMonth ? "bg-white" : "bg-purple-500/5",
                  "min-h-20 h-20 p-1 align-top border border-orange-400"
                )}
              >
                {dayNumber && <strong>{dayNumber}</strong>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MonthView;
