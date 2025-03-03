import React, { useEffect, useState } from "react";
import "./modal.css";
import { useCalendar } from "../contexts/CalendarContext";
import { getDate, lightFormat, startOfWeek, getDay, getMonth, getYear} from "date-fns";

const Modal = () => {
  const { displayModal, setDisplayModal } = useCalendar();
  const { selectedDate, setSelectedDate } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();
  const { arrayList, setArrayList } = useCalendar();
  const { weekArrayList, setWeekArrayList } = useCalendar();
  const { monthlyEventCount, setMonthlyEventCount } = useCalendar();
  

  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");

  useEffect(() => {
    setEventDate(modalInputValue.eventDate || "");
    setEventName(modalInputValue.eventName || "");
    setEventDescription(modalInputValue.eventDescription || "");
    setEventStartTime(modalInputValue.eventStartTime || "");
    setEventEndTime(modalInputValue.eventEndTime || "");
  }, [modalInputValue]);

  const closeModal = () => {
    setDisplayModal(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "eventModal") {
      setDisplayModal(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempArrayList = [];
    const eventDateObj = new Date(eventDate);
    const selectedDateStr = lightFormat(new Date(selectedDate), "yyyy-MM-dd");
    const eventDateStr = eventDateObj.toISOString().split("T")[0];
    const selectedMonth = getMonth(new Date(selectedDate));
    const selectedYear = getYear(new Date(selectedDate));
    const eventMonth = getMonth(eventDateObj);
    const eventYear = getYear(eventDateObj);

    const isSameMonth = selectedMonth === eventMonth && selectedYear === eventYear;

    if (selectedDateStr === eventDateStr) {
      tempArrayList = arrayList;
    } else {
      const key = eventDateStr;
      const savedList = localStorage.getItem(key);
      if (savedList) {
        tempArrayList = JSON.parse(savedList);
      }
    }
    
    const newEvent = {
      eventDate: eventDate,
      eventName: eventName,
      eventDescription: eventDescription,
      eventStartTime: eventStartTime,
      eventEndTime: eventEndTime,
    };
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };
    const eventStart = timeToMinutes(eventStartTime);
    const eventEnd = timeToMinutes(eventEndTime);

    const isOverlapping = tempArrayList.some((event) => {
      const existingStart = timeToMinutes(event.eventStartTime);
      const existingEnd = timeToMinutes(event.eventEndTime);
      return (
        (eventStart > existingStart && eventStart < existingEnd) ||
        (eventEnd > existingStart && eventEnd < existingEnd) ||
        (eventStart < existingStart && eventEnd > existingEnd)
      );
    });
    if (isOverlapping) {
      alert(
        "Event overlaps with an existing event. Please choose a different time."
      );
      return;
    }
    let isNewEvent = false;
    let updatedList = [...tempArrayList];
    const eventIndex = updatedList.findIndex(
      (event) =>
        event.eventStartTime === eventStartTime &&
        event.eventEndTime === eventEndTime
    );
    if (eventIndex !== -1) {
      updatedList[eventIndex] = newEvent;
    } else {
      updatedList.push(newEvent);
      isNewEvent = true;
    }

    const isSameWeek = (date1, date2) => {
      const startOfWeek1 = startOfWeek(date1, { weekStartsOn: 0 });
      const startOfWeek2 = startOfWeek(date2, { weekStartsOn: 0 });
      return startOfWeek1.getTime() === startOfWeek2.getTime();
    };
    if (selectedDateStr === eventDateStr) {
      setArrayList(updatedList);
    } else if (isSameWeek(new Date(selectedDate), eventDateObj)) {
      const eventIndex = getDay(eventDateObj);
      if (eventIndex !== -1) {
        const updatedWeekArray = [...weekArrayList];
        updatedWeekArray[eventIndex] = updatedList;
        setWeekArrayList(updatedWeekArray);
        const key = eventDateStr;
        localStorage.setItem(key, JSON.stringify(updatedList));
      }
    } else {
      const key = eventDateStr;
      localStorage.setItem(key, JSON.stringify(updatedList));
    }

    if (isSameMonth) {
      const key = eventDateStr;
      localStorage.setItem(key, JSON.stringify(updatedList));

      if (isNewEvent) {
        setMonthlyEventCount((prev) =>
          prev.map((entry) =>
            entry.date === eventDateStr
              ? { ...entry, count: entry.count + 1 }
              : entry
          )
        );
      }
    }

    setDisplayModal(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();

    let tempArrayList = [];
    const eventDateObj = new Date(eventDate);
    const selectedDateStr = lightFormat(new Date(selectedDate), "yyyy-MM-dd");
    const eventDateStr = eventDateObj.toISOString().split("T")[0];
    console.log(`Selected Date: ${selectedDateStr}`);
    console.log(`Event Date: ${eventDateStr}`);
    if (selectedDateStr === eventDateStr) {
      tempArrayList = arrayList;
    } else {
      const key = eventDateStr;
      const savedList = localStorage.getItem(key);
      if (savedList) {
        tempArrayList = JSON.parse(savedList);
      }
    }

    let updatedList = [...tempArrayList];
    const eventIndex = updatedList.findIndex(
      (event) =>
        event.eventStartTime === eventStartTime &&
        event.eventEndTime === eventEndTime
    );
    if (eventIndex !== -1) {
      updatedList.splice(eventIndex, 1);
    }
    const isSameWeek = (date1, date2) => {
      const startOfWeek1 = startOfWeek(date1, { weekStartsOn: 0 });
      const startOfWeek2 = startOfWeek(date2, { weekStartsOn: 0 });
      return startOfWeek1.getTime() === startOfWeek2.getTime();
    };
    if (selectedDateStr === eventDateStr) {
      setArrayList(updatedList);
    } else if (isSameWeek(new Date(selectedDate), eventDateObj)) {
      const eventIndex = getDay(eventDateObj);
      if (eventIndex !== -1) {
        const updatedWeekArray = [...weekArrayList];
        updatedWeekArray[eventIndex] = updatedList;
        setWeekArrayList(updatedWeekArray);
        const key = eventDateStr;
        localStorage.setItem(key, JSON.stringify(updatedList));
      }
    } else {
      const key = eventDateStr;
      localStorage.setItem(key, JSON.stringify(updatedList));
    }
    setDisplayModal(false);
  };

  return (
    <div id="eventModal" className="modal" onClick={handleOutsideClick}>
      <div className="modal-content">
        <span id="closeModal" className="close" onClick={closeModal}>
          ×
        </span>
        <h2 className="h2">Create Event</h2>
        <form id="eventForm">
          <label htmlFor="eventDate">Event Date:</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <label htmlFor="eventDescription">Event Description:</label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
          <label htmlFor="eventStartTime">Event Start Time:</label>
          <input
            type="time"
            id="eventStartTime"
            name="eventStartTime"
            value={eventStartTime}
            onChange={(e) => setEventStartTime(e.target.value)}
            required
          />
          <label htmlFor="eventEndTime">Event End Time:</label>
          <input
            type="time"
            id="eventEndTime"
            name="eventEndTime"
            value={eventEndTime}
            onChange={(e) => setEventEndTime(e.target.value)}
            required
          />
          <input
            type="text"
            defaultValue="create-btn"
            name="formtype"
            id="formtype"
            style={{ display: "none" }}
          />
          <div className="modal-buttons">
            <button type="submit" onClick={handleSubmit}>
              Save Event
            </button>
            <button
              type="delete"
              className="delete-button"
              onClick={handleDelete}
            >
              Delete Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
