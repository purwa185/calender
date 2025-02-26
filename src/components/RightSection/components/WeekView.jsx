import React from "react";
import "./weekview.css";
import { useCalendar } from "../../../contexts/CalendarContext";

const WeekView = () => {
  const { selectedDate, weekArrayList } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();

  const hours = Array.from({ length: 25 }, (_, i) => i);

  const selectedDateObj = new Date(selectedDate);
  const startOfWeek = new Date(selectedDateObj);
  startOfWeek.setDate(selectedDateObj.getDate() - selectedDateObj.getDay());

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const newDate = new Date(startOfWeek);
    newDate.setDate(startOfWeek.getDate() + i);
    return newDate;
  });

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <>
  
      <div className="week-header">
        <div className="time-column"></div>
        {daysOfWeek.map((date, index) => (
          <div key={index} className="weekview-header">
            <span className="day-in-weekview-header">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="date-in-weekview-header">{date.getDate()}</span>
          </div>
        ))}
      </div>

      <div className="week-container"> 
      <div className="week-grid">
        <div className="time-column">
          {hours.map((hour, index) => (
            <div key={index} className="time-slot">
              {hour === 24
                ? "12 AM"
                : (hour % 12 || 12) + (hour < 12 ? " AM" : " PM")}
            </div>
          ))}
        </div>

        {daysOfWeek.map((date, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {hours.map((_, hourIndex) => (
              <div key={hourIndex} className="calendar-cell"></div>
            ))}
            {weekArrayList[dayIndex]?.map((event, eventIndex) => {
              const eventStart = timeToMinutes(event.eventStartTime);
              const eventEnd = timeToMinutes(event.eventEndTime);
              const eventDuration = eventEnd - eventStart;
              return (
                <div
                  key={eventIndex}
                  className="event-box"
                  style={{
                    top: `${eventStart}px`,
                    height: `${eventDuration}px`,
                    width: "150.8px",
                    position: "absolute",
                    backgroundColor: "rgb(30, 135, 247)",
                    borderRadius: "5px",
                    color: "rgb(255, 255, 255)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalInputValue({
                      eventStartTime: event.eventStartTime,
                      eventEndTime: event.eventEndTime,
                      eventName: event.eventName,
                      eventDescription: event.eventDescription,
                    });
                  }}
                >
                  <div>{event.eventName}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </div>

    </>
  );
};

export default WeekView;
