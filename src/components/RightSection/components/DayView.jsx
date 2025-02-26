import React from "react";
import { format, lightFormat } from "date-fns";
import { useCalendar } from "../../../contexts/CalendarContext";
import "./dayview.css";

const DayView = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { displayModal, setDisplayModal } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();
  const { arrayList, setArrayList } = useCalendar();

  const selectedDateObj = new Date(selectedDate);
  const hours = Array.from({ length: 26 }, (_, i) => i);
  const formattedDate = format(new Date(selectedDate), "EEE d").toUpperCase();

  const handleDaySlotClick = (hour) => {
    let startTime = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    let endTime =
      hour + 1 === 24
        ? "00:00"
        : hour + 1 < 10
        ? `0${hour + 1}:00`
        : `${hour + 1}:00`;

    setModalInputValue({
      eventDescription: "",
      eventName: "",
      eventStartTime: startTime,
      eventEndTime: endTime,
      eventDate: lightFormat(new Date(selectedDate), "yyyy-MM-dd"),
    });
    setDisplayModal(true);
  };

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="day-view">
      <header className="header">
        <div className="dayview-header">
          <span className="day-in-dayview-header">{format(new Date(selectedDate), "eee")}</span>
          <span className="date-in-dayview-header">{format(new Date(selectedDate), "d")}</span>
        </div>
      </header>
      <div className="day-grid-container">
        <div className="day-grid">
          {hours.map((hour) => (
            <div
              key={hour}
              className="hour-slot"
              onClick={() => handleDaySlotClick(hour)}
            >
              <div className="hour-label-div">
                <span className="hour-label">
                  {hour === 24
                    ? "12 AM"
                    : (hour % 12 || 12) + (hour < 12 ? " AM" : " PM")}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="events-container">
          {arrayList.map((event, index) => {
            const eventStart = timeToMinutes(event.eventStartTime);
            const eventEnd = timeToMinutes(event.eventEndTime);
            const eventDuration = eventEnd - eventStart;
            
            return (
              <div
                key={index}
                className="event"
                style={{
                  top: `${eventStart}px`,
                  height: `${eventDuration}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalInputValue({
                    eventStartTime: event.eventStartTime,
                    eventEndTime: event.eventEndTime,
                    eventDate: lightFormat(
                      new Date(selectedDate),
                      "yyyy-MM-dd"
                    ),
                    eventName: event.eventName,
                    eventDescription: event.eventDescription,
                  });
                  setDisplayModal(true);
                }}
              >
                <div className="event-name-div">
                  <span>{event.eventName}</span>
                </div>
                <div className="event-description-div">
                  <span>{event.eventDescription}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
