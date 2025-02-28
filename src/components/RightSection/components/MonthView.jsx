import React from "react";
import { useCalendar } from "../../../contexts/CalendarContext";
import "./monthview.css";

const Calendar = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const selectedDateObj = new Date(selectedDate);
  const month = selectedDateObj.getMonth();
  const year = selectedDateObj.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDate = new Date();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let k = 0;
  let count = 0;
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="calendar-day empty">
        {k < 7 && <span className="day-name empty">{daysOfWeek[k]}</span>}
      </div>
    );
    k++;
    count++;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (day) =>
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear();
    
    
    const dateObj = calendarDays.push(
      <div key={day} className="calendar-day">
        <div>
        {k < 7 && <span className="day-name">{daysOfWeek[k]}</span>}
        <span className={`date ${isToday(day) ? "current-date" : ""}`}>{day}</span>
        </div>
      </div>
    );
    k++;
    count++;
  }
  let size = count <= 35 ? 35 - count : 42 - count;
  for (let i = 0; i < size; i++) {
    calendarDays.push(
      <div key={`extra-${i}`} className="calendar-day empty"></div>
    );
    count++;
  }
  return <div className="container-calendar">{calendarDays}</div>;
};

export default Calendar;
