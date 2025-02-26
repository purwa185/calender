import React from "react";
import { useCalendar } from "../../../../../contexts/CalendarContext.jsx";

const CalendarHeader = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const showDateInCalendar = new Date(selectedDate);

  const handlePrevMonth = () => {
    const date = new Date(selectedDate);
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    setSelectedDate(prevMonthDate.getTime());
  };

  const handleNextMonth = () => {
    const date = new Date(selectedDate);
    const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    setSelectedDate(nextMonthDate.getTime());
  };

  return (
    <div className="calendar-header">
      <div className="show-dy">
        <span id="month-year">
          {showDateInCalendar.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="show-btn">
        <img
          src="/left-arrow.png"
          alt="Previous Month"
          id="prev-month"
          onClick={handlePrevMonth}
        />
        <img
          src="/right-arrow.png"
          alt="Next Month"
          id="next-month"
          onClick={handleNextMonth}
        />
      </div>
    </div>
  );
};

export default CalendarHeader;
