import React, { useState, useEffect } from "react";
import CalendarHeader from "./components/CalendarHeader.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import "./calendar.css"
import { useCalendar } from "../../../../contexts/CalendarContext.jsx";

const Left2 = () => {
  const {selectedDate, setSelectedDate} = useCalendar();
 
  return (
    <div className="left2">
    <div className="calendar">
       <CalendarHeader />
       <CalendarGrid /> 
    </div>
    </div>
  );
};

export default Left2;
