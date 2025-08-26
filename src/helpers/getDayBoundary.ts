import DateObject from "react-date-object";

type BoundaryType = "start" | "both" | "end";

export function getDayBoundary(date: DateObject, boundary: "start"): DateObject;
export function getDayBoundary(date: DateObject, boundary: "end"): DateObject;
export function getDayBoundary(
  date: DateObject,
  boundary: "both"
): {
  start: DateObject;
  end: DateObject;
};

export function getDayBoundary(date: DateObject, boundary: BoundaryType): any {
  const calculations = {
    start: () => new DateObject(date).set({ hour: 0, minute: 0, second: 0 }),
    end: () => new DateObject(date).set({ hour: 23, minute: 59, second: 59 }),
    both: () => ({
      start: calculations.start(),
      end: calculations.end(),
    }),
  };

  return calculations[boundary]();
}
