import React from "react";
import { useState } from "react";
import { format, lightFormat } from "date-fns";
import { useCalendar } from "../../../contexts/CalendarContext";
import "./dayview.css";

const DayView = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { displayModal, setDisplayModal } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();
  const { arrayList, setArrayList } = useCalendar();
  const [draggedEvent, setDraggedEvent] = useState(null);

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

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours < 10 ? `0${hours}` : hours}:${mins < 10 ? "00" : mins}`;
  };

  const handleDragStart = (e, event, index) => {
    setDraggedEvent({ ...event, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedEvent) return;
    const dropY =
      e.clientY +
      e.currentTarget.scrollTop -
      e.currentTarget.getBoundingClientRect().top;
    const newStartMinutes = Math.round(dropY / 15) * 15;
    const duration =
      timeToMinutes(draggedEvent.eventEndTime) -
      timeToMinutes(draggedEvent.eventStartTime);
    const newStartTime = minutesToTime(newStartMinutes);
    const newEndTime = minutesToTime(newStartMinutes + duration);

    const isOverlap = arrayList.some((event, i) => {
      if (i === draggedEvent.index) return false;
      const eventStart = timeToMinutes(event.eventStartTime);
      const eventEnd = timeToMinutes(event.eventEndTime);
      const newStart = timeToMinutes(newStartTime);
      const newEnd = timeToMinutes(newEndTime);
      return !(newEnd <= eventStart || newStart >= eventEnd);
    });

    if (isOverlap) {
      alert("Error: Event overlaps with an existing event!");
      return;
    }
    const updatedEvents = arrayList.map((event, i) =>
      i === draggedEvent.index
        ? { ...event, eventStartTime: newStartTime, eventEndTime: newEndTime }
        : event
    );
    setArrayList(updatedEvents);
    setDraggedEvent(null);
  };

  const handleResizeStart = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    document.body.style.cursor = "ns-resize"; 
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const moveY = moveEvent.clientY - startY;
      const newEndMinutes =
        timeToMinutes(arrayList[index].eventEndTime) +
        Math.round(moveY / 15) * 15;
      const newEndTime = minutesToTime(newEndMinutes);
      if (newEndMinutes - timeToMinutes(arrayList[index].eventStartTime) >= 15) {
        setArrayList((prevEvents) =>
          prevEvents.map((event, i) =>
            i === index ? { ...event, eventEndTime: newEndTime } : event
          )
        );
      }
    };
    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="day-view">
      <header className="header">
        <div className="dayview-header">
          <span className="day-in-dayview-header">
            {format(new Date(selectedDate), "eee")}
          </span>
          <span className="date-in-dayview-header">
            {format(new Date(selectedDate), "d")}
          </span>
        </div>
      </header>
      <div
        className="day-grid-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
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
              <>
                <div
                  key={index}
                  className={`event ${
                    draggedEvent?.index === index ? "dragging" : ""
                  }`}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, event, index)}
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
                <div
                  className="resize-handle"
                  style={{
                    top: `${eventStart + eventDuration - 2}px`,
                    height: `2px`,
                  }}
                  onMouseDown={(e) => handleResizeStart(e, index)}
                ></div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
