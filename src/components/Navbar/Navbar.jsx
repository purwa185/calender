import React, { useState } from "react";
import MenuButton from "./components/MenuButton";
import CalendarButton from "./components/CalendarButton";
import TodayButton from "./components/TodayButton";
import PrevButton from "./components/PrevButton";
import NextButton from "./components/NextButton";
import DateInNavbar from "./components/DateInNavbar";
import SelectView from "./components/SelectView";
import "./navbar.css"
import CustomDropdown from "./components/CustomDropdown";
import { useCalendar } from "../../contexts/CalendarContext";
import { getTime } from "date-fns";

const Navbar = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const {selectedView, setSelectedView} = useCalendar();

  const handleTodayClick = () => {
    setSelectedDate(getTime(new Date()));
  };

  const handlePrevClick = () => {
    
  };

  const handleNextClick = () => {
    
  };

  return (
    <div className="nav">
      <div className="nav1">
        <ul className="navbar">
          <li><MenuButton /></li>
          <li><CalendarButton/></li>
          <li><TodayButton onClick={handleTodayClick} /></li>
          <li><PrevButton onClick={handlePrevClick} /></li>
          <li><NextButton onClick={handleNextClick} /></li>
          <li><DateInNavbar/></li>
        </ul>
      </div>
      <div className="nav2">
        <ul className="navbar">
          {/* <li><SelectView currentView={currentView} onViewChange={setCurrentView} /></li> */}
          <li> <CustomDropdown/> </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;