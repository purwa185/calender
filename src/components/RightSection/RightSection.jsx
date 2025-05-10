import React from "react";
import "./rightsection.css";
import DayView from "./components/DayView";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import { useCalendar } from "../../contexts/CalendarContext";
import { VIEW_MODE } from "../../constants/constants";

const RightSection = () => {
  const { selectedView, setSelectedView } = useCalendar();

  return (
    <div className="section-right">
      {selectedView === VIEW_MODE.MONTH_VIEW && <MonthView />}
      {selectedView === VIEW_MODE.WEEK_VIEW && <WeekView />}
      {selectedView === VIEW_MODE.DAY_VIEW && <DayView />}
    </div>
  );
};

export default RightSection;
