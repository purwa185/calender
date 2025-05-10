import React from "react";
import { useCalendar } from "../../../contexts/CalendarContext";
import Modal from "../../../common/Modal";
import { useEffect } from "react";
import { lightFormat } from "date-fns";

const Left1 = () => {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { displayModal, setDisplayModal } = useCalendar();
  const { modalInputValue, setModalInputValue } = useCalendar();

  const handleCreateClick = () => {
    modalInputValue.eventDate = lightFormat(new Date(selectedDate),'yyyy-MM-dd');
    modalInputValue.eventStartTime="";
    modalInputValue.eventEndTime="";
    modalInputValue.eventName="";
    modalInputValue.eventDescription="";
    setModalInputValue(modalInputValue);
    setDisplayModal(true);
  };

  useEffect(() => {
    console.log("Modal state changed:", displayModal);
  }, [displayModal]);

  return (
    <div className="left1">
      <div className="addeventbtn" onClick={handleCreateClick}>
        <img src="/plus.png" alt="Add Event" className="plus" />
        <span id="addevent"> Create </span>
      </div>
      {displayModal && <Modal/>}
    </div>
  );
};

export default Left1;
