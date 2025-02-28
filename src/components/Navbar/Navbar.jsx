import React, { useState } from "react";
import MenuButton from "./components/MenuButton";
import CalendarButton from "./components/CalendarButton";
import TodayButton from "./components/TodayButton";
import PrevButton from "./components/PrevButton";
import NextButton from "./components/NextButton";
import DateInNavbar from "./components/DateInNavbar";
import SelectView from "./components/SelectView";
import "./navbar.css";
import CustomDropdown from "./components/CustomDropdown";
import { useCalendar } from "../../contexts/CalendarContext";
import { getTime, subDays, subWeeks, subMonths, addDays, addWeeks, addMonths } from "date-fns";
import { VIEW_MODE } from "../../constants/constants";

const Navbar = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { selectedView, setSelectedView } = useCalendar();

  const handleTodayClick = () => {
    setSelectedDate(getTime(new Date()));
  };

  const handlePrevClick = () => {
    switch (selectedView) {
      case VIEW_MODE.DAY_VIEW:
        setSelectedDate(getTime(subDays(selectedDate, 1)));
        break;
      case VIEW_MODE.WEEK_VIEW:
        setSelectedDate(getTime(subWeeks(selectedDate, 1)));
        break;
      case VIEW_MODE.MONTH_VIEW:
        setSelectedDate(getTime(subMonths(selectedDate, 1)));
        break;
      default:
        console.warn("Unknown view mode");
    }
  };

  const handleNextClick = () => {
    switch (selectedView) {
      case VIEW_MODE.DAY_VIEW:
        setSelectedDate(getTime(addDays(selectedDate, 1)));
        break;
      case VIEW_MODE.WEEK_VIEW:
        setSelectedDate(getTime(addWeeks(selectedDate, 1)));
        break;
      case VIEW_MODE.MONTH_VIEW:
        setSelectedDate(getTime(addMonths(selectedDate, 1)));
        break;
      default:
        console.warn("Unknown view mode");
    }
  };

  return (
    <div className="nav">
      <div className="nav1">
        <ul className="navbar">
          <li>
            <MenuButton />
          </li>
          <li>
            <CalendarButton />
          </li>
          <li>
            <TodayButton onClick={handleTodayClick} />
          </li>
          <li>
            <PrevButton onClick={handlePrevClick} />
          </li>
          <li>
            <NextButton onClick={handleNextClick} />
          </li>
          <li>
            <DateInNavbar />
          </li>
        </ul>
      </div>
      <div className="nav2">
        <ul className="navbar">
          {/* <li><SelectView currentView={currentView} onViewChange={setCurrentView} /></li> */}
          <li>
            {" "}
            <CustomDropdown />{" "}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
