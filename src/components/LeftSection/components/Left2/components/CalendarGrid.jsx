import React from "react";
import {
  getYear,
  endOfMonth,
  getDay,
  startOfMonth,
  getDaysInMonth,
  getMonth,
  getTime,
  fromUnixTime,
} from "date-fns";
import { useCalendar } from "../../../../../contexts/CalendarContext.jsx";
import { VIEW_MODE } from "../../../../../constants/constants.js";

const CalendarGrid = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { selectedView, setSelectedView } = useCalendar();
  const startofmonth = startOfMonth(new Date(selectedDate));
  const endofmonth = endOfMonth(new Date(selectedDate));
  const firstDay = getDay(startofmonth);
  const daysInMonth = getDaysInMonth(new Date(selectedDate));
  const month = getMonth(selectedDate);
  const year = getYear(selectedDate);
  const currentDate = new Date();
  const selectedDateObj = new Date(selectedDate);

  const selectDate = (index) => {
    const year = getYear(new Date(selectedDate));
    const month = getMonth(new Date(selectedDate));
    const newDate = new Date(year, month, index);
    const timestamp = getTime(newDate);
    setSelectedDate(getTime(newDate));
  };

  const isToday = (day) =>
    day === currentDate.getDate() &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear();
  const isSelectedDate = (day) =>
    day === selectedDateObj.getDate() &&
    month === selectedDateObj.getMonth() &&
    year === selectedDateObj.getFullYear();

  return (
    <div className="calendar-grid">
      <div className="weekday">S</div>
      <div className="weekday">M</div>
      <div className="weekday">T</div>
      <div className="weekday">W</div>
      <div className="weekday">T</div>
      <div className="weekday">F</div>
      <div className="weekday">S</div>
      {Array.from({ length: firstDay }, (_, index) => (
        <div key={`empty-${index}`} className="day"></div>
      ))}
      {Array.from({ length: daysInMonth }, (_, index) => (
        <div
          key={`day-${index + 1}`}
          className={` day ${
            isSelectedDate(index + 1) ? "selected-date-in-calendar" : ""
          } ${isToday(index + 1) ? "current-date-in-calendar" : ""}`}
          onClick={() => selectDate(index + 1)}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
