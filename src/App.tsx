import DayVistaCalendar from "./components/day-vista-calendar";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { CustomDragLayer } from "./components/CustomDragLayer";
function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <DayVistaCalendar />;
      <CustomDragLayer />
    </DndProvider>
  );
}

export default App;
