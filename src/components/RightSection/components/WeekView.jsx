import React, { useState } from "react";
import "./weekview.css";
import { useCalendar } from "../../../contexts/CalendarContext";
import { lightFormat } from "date-fns";

const WeekView = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();
  const { weekArrayList, setWeekArrayList } = useCalendar();
  const { displayModal, setDisplayModal } = useCalendar();
  const [draggedEvent, setDraggedEvent] = useState(null);

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
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? "00" : mins}`;
  };
  const handleWeekSlotClick = (hour, date) => {
    console.log(date);
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
      eventDate: lightFormat(date, "yyyy-MM-dd"),
    });
    setDisplayModal(true);
  };

  const handleDragStart = (e, event, eventIndex, dayIndex) => {
    setDraggedEvent({ ...event, eventIndex, dayIndex });
  };

  const handleDrop = (e, newHour, newDayIndex) => {
    e.preventDefault();
    if (!draggedEvent) return;
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - boundingRect.top;
    let newMinutes = Math.round(offsetY);
    newMinutes = Math.round(newMinutes / 15) * 15;
    if (newMinutes >= 60) {
      newHour += 1;
      newMinutes = 0;
    }
    const formattedMinutes = newMinutes < 10 ? `0${newMinutes}` : newMinutes;
    const newStartTime = `${
      newHour < 10 ? `0${newHour}` : newHour
    }:${formattedMinutes}`;
    const eventDuration =
      timeToMinutes(draggedEvent.eventEndTime) -
      timeToMinutes(draggedEvent.eventStartTime);
    const newEndTime = minutesToTime(
      timeToMinutes(newStartTime) + eventDuration
    );

    const hasOverlap = weekArrayList[newDayIndex]?.some((event, i) => {
      if (draggedEvent && i === draggedEvent.eventIndex) return false;
      const existingStart = timeToMinutes(event.eventStartTime);
      const existingEnd = timeToMinutes(event.eventEndTime);
      const newStart = timeToMinutes(newStartTime);
      const newEnd = timeToMinutes(newEndTime);

      return !(newEnd <= existingStart || newStart >= existingEnd);
    });

    if (hasOverlap) {
      alert("Cannot move event. Overlapping with another event.");
      return;
    }
    const updatedWeekArrayList = [...weekArrayList];
    updatedWeekArrayList[draggedEvent.dayIndex] = updatedWeekArrayList[
      draggedEvent.dayIndex
    ].filter((_, i) => i !== draggedEvent.eventIndex);
    updatedWeekArrayList[newDayIndex] = [
      ...(updatedWeekArrayList[newDayIndex] || []),
      {
        ...draggedEvent,
        eventStartTime: newStartTime,
        eventEndTime: newEndTime,
        eventDate: lightFormat(daysOfWeek[newDayIndex], "yyyy-MM-dd"),
      },
    ];
    setWeekArrayList(updatedWeekArrayList);
    setDraggedEvent(null);
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
                <div
                  key={hourIndex}
                  className="calendar-cell"
                  onClick={() => handleWeekSlotClick(hourIndex, date)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, hourIndex, dayIndex)}
                ></div>
              ))}
              {weekArrayList[dayIndex]?.map((event, eventIndex) => {
                const eventStart = timeToMinutes(event.eventStartTime);
                const eventEnd = timeToMinutes(event.eventEndTime);
                const eventDuration = eventEnd - eventStart;
                return (
                  <div
                    key={eventIndex}
                    className={`event-box ${
                      draggedEvent?.eventIndex === eventIndex &&
                      draggedEvent?.dayIndex === dayIndex
                        ? "dragging"
                        : ""
                    }`}
                    draggable="true"
                    onDragStart={(e) =>
                      handleDragStart(e, event, eventIndex, dayIndex)
                    }
                    onDragEnd={(e) => setDraggedEvent(null)}
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
                        eventDate: lightFormat(new Date(date), "yyyy-MM-dd"),
                      });
                      setDisplayModal(true);
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
