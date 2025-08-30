import clsx from "clsx";
import IconWrapper from "./IconWrapper";
import { VIEW_OPTIONS } from "../constants";
import ArrowDownIcon from "../icons/ArrowDown";
import FilterListIcon from "../icons/FilterList";
import CalendarSwitcher from "./ClanedarSwitcher";
import { useCallback, useEffect, useState } from "react";
import ThinArrowRightIcon from "../icons/ThinArrowRight";
import { useCalendarStore } from "../store/calendarStore";
import type { VIEW_OPTIONS_TYPES } from "../types/globalTypes";
import { useGetDate } from "../hooks/useGetDate";

const Header = () => {
  const getDate = useGetDate();
  const goToToday = useCalendarStore((state) => state.goToToday);
  const goToNext = useCalendarStore((state) => state.goToNext);
  const goToPrev = useCalendarStore((state) => state.goToPrev);
  const setViewType = useCalendarStore((state) => state.setViewType);
  const calendarType = useCalendarStore((state) => state.calendarType);
  const [showViewOptions, setShowViewOptions] = useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<VIEW_OPTIONS_TYPES>(VIEW_OPTIONS[0]);

  const handleShowViewOptions = useCallback(() => {
    setShowViewOptions((prev) => !prev);
  }, []);

  const handleClick = useCallback(
    (option: VIEW_OPTIONS_TYPES) => {
      setSelectedView(option);
      setViewType(option.value);
      setShowViewOptions(false);
    },
    [setViewType]
  );

  useEffect(() => {
    setViewType(VIEW_OPTIONS[0].value);
  }, [setViewType]);

  return (
    <div className="w-full flex justify-between items-center mx-auto relative py-2">
      <section
        id="viewOptionsButton"
        className="relative space-x-1 flex justify-between items-center max-w-4/12 "
      >
        <div className="group">
          <div
            onClick={handleShowViewOptions}
            className="inline-flex items-center min-w-1/5 py-1 px-4 rounded-md pointer ml-1 hover:bg-zinc-400/30 group-hover:text-zinc-700/80 transition-colors"
          >
            <IconWrapper className="mr-1">{selectedView.icon}</IconWrapper>
            <p className="font-semibold text-lg select-none">{selectedView.label}</p>
            <IconWrapper className="ml-2">
              <ArrowDownIcon
                className={clsx(
                  showViewOptions ? "rotate-180 transition duration-500" : "transition duration-500"
                )}
              />
            </IconWrapper>
          </div>
        </div>
        <CalendarSwitcher />
        <ul
          className={clsx(
            showViewOptions ? "flex transition duration-500" : "hidden",
            `absolute flex-col bg-white shadow top-10 min-w-[140px] rounded-b-lg p-1 z-100`
          )}
        >
          {VIEW_OPTIONS.map((option, index) => (
            <li
              key={index}
              role="button"
              onClick={() => handleClick(option)}
              className={clsx(
                option.value === selectedView.value ? "bg-gray-300/60" : "",
                `inline-flex items-center p-2 pointer hover:bg-gray-300/50 hover:scale-105 transition-colors my-[2px] rounded-sm`
              )}
            >
              {option.icon && <IconWrapper className="mr-2">{option.icon}</IconWrapper>}
              <p className="text-md">{option.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="movementButtons" className="relative max-w-4/12">
        <div className="flex items-center">
          <IconWrapper
            onClickFn={goToPrev}
            className="hover:bg-gray-300/30 rounded-full p-2 transform -rotate-180 rtl:rotate-0 pointer select-none"
          >
            <ThinArrowRightIcon strokeWidth={2} />
          </IconWrapper>
          <p className="flex gap-2 font-bold tracking-wider text-xl mx-2 select-none">
            <span dir={calendarType === "gregorian" ? "ltr" : "rtl"} className="font-semibold text-2xl">
              {getDate}
            </span>
          </p>
          <IconWrapper
            onClickFn={goToNext}
            className="hover:bg-gray-300/30 rounded-full p-2 transform pointer select-none rtl:-rotate-180"
          >
            <ThinArrowRightIcon strokeWidth={2} />
          </IconWrapper>
        </div>
      </section>

      <section id="filterButtons" className="relative max-w-4/12">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => goToToday()}
            className="mr-2 bg-orange-400 hover:bg-orange-500 px-4 py-1 rounded-md pointer"
          >
            <p className="font-semibold text-white/90 text-md select-none">Today</p>
          </button>
          <IconWrapper
            onClickFn={() => console.log("filter Icon")}
            className="hover:bg-gray-300/30 rounded-full p-2 select-none"
          >
            <FilterListIcon />
          </IconWrapper>
        </div>
      </section>
    </div>
  );
};

export default Header;
