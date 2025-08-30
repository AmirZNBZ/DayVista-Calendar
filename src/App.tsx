import DayVistaCalendar from "./components/day-vista-calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { CustomDragLayer } from "./components/CustomDragLayer";
import { useCalendarStore } from "./store/calendarStore";
import { useEffect } from "react";
function App() {
  const locale = useCalendarStore((state) => state.locale);

  useEffect(() => {
    const direction = locale === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = direction;
    document.documentElement.lang = locale === "fa" ? "fa" : "en"; // برای SEO و Accessibility بهتر
  }, [locale]);

  return (
    <DndProvider backend={HTML5Backend}>
      <DayVistaCalendar />
      <CustomDragLayer />
    </DndProvider>
  );
}

export default App;
