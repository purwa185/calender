import React from "react";
import { useCalendar } from "../../../contexts/CalendarContext";
import { getMonth, getDate, getYear  } from "date-fns";


const DateInNavbar = () => {
  const {selectedDate, setSelectedDate}= useCalendar();
  const months= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const selectedDateObj = new Date(selectedDate);
  const month= getMonth(selectedDateObj);
  const date= getDate(selectedDateObj);
  const year= getYear(selectedDateObj);
  return <div id="displaydate">{` ${months[month]} ${date}, ${year} `}</div>;
};

export default DateInNavbar;