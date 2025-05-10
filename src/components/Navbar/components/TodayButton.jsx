import React from "react";
import { useCalendar } from "../../../contexts/CalendarContext";

const TodayButton = ({ onClick }) => {
  return <a id="today" onClick={onClick}>Today</a>;
};

export default TodayButton;


