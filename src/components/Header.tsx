import { useState } from "react";
import { VIEW_OPTIONS } from "../constants";
import ArrowDownIcon from "../icons/ArrowDown";
import IconWrapper from "./IconWrapper";
import type { VIEW_OPTIONS_TYPES } from "../types/globalTypes";
import clsx from "clsx";
import ThinArrowRightIcon from "../icons/ThinArrowRight";

const Header = () => {
  const [selectedView, setSelectedView] = useState<VIEW_OPTIONS_TYPES>(VIEW_OPTIONS[0]);
  const [showViewOptions, setShowViewOptions] = useState<boolean>(false);

  const handleShowViewOptions = () => {
    setShowViewOptions((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-between items-center mx-auto relative">
      <section id="viewOptionsButton" className="relative flex justify-between items-center max-w-4/12">
        <div
          onClick={handleShowViewOptions}
          className="inline-flex items-center min-w-1/5 py-1 px-4 rounded-md cursor-pointer min-w- hover:bg-gray-300/50 transition-colors"
        >
          <IconWrapper className="mr-1">{selectedView.icon}</IconWrapper>
          <p className="font-semibold text-lg">{selectedView.label}</p>
          <IconWrapper className="ml-2">
            <ArrowDownIcon />
          </IconWrapper>
        </div>
        <ul
          className={clsx(
            showViewOptions ? "flex transition duration-500" : "hidden",
            `absolute flex-col bg-white shadow top-10 min-w-[140px] rounded-b-lg p-1`
          )}
        >
          {VIEW_OPTIONS.map((option, index) => (
            <li
              key={index}
              role="button"
              onClick={() => {
                setSelectedView(option);
                setShowViewOptions(false);
              }}
              className={clsx(
                option.value === selectedView.value ? "bg-gray-300/60" : "",
                `inline-flex items-center p-2 cursor-pointer hover:bg-gray-300/50 transition-colors my-[2px] rounded-sm`
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
          <IconWrapper className="hover:bg-gray-300/30 rounded-full p-2 transform -rotate-180">
            <ThinArrowRightIcon strokeWidth={2} />
          </IconWrapper>
          <p className="font-bold tracking-wider text-xl mx-2">29 Jul 2025</p>
          <IconWrapper className="hover:bg-gray-300/30 rounded-full p-2 transform">
            <ThinArrowRightIcon strokeWidth={2} />
          </IconWrapper>
        </div>
      </section>
      <section id="filterButtons" className="relative max-w-4/12">
        dasdasd
      </section>
    </div>
  );
};

export default Header;
