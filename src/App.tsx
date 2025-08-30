import DayVistaCalendar from "./components/day-vista-calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { CustomDragLayer } from "./components/CustomDragLayer";
import { useCalendarStore } from "./store/calendarStore";
import { useEffect } from "react";
function App() {
  const calendarType = useCalendarStore((state) => state.calendarType);

  useEffect(() => {
    const direction = calendarType === "persian" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = calendarType === "persian" ? "fa" : "en"; // برای SEO و Accessibility بهتر
  }, [calendarType]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DayVistaCalendar />
      <CustomDragLayer />
    </DndProvider>
  );
}

export default App;
