import { createContext, useContext, useEffect, useState } from "react";
import { VIEW_MODE } from "../constants/constants";
import { lightFormat, startOfWeek, addDays } from "date-fns";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [selectedView, setSelectedView] = useState(VIEW_MODE.MONTH_VIEW);
  const [arrayList, setArrayList] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [modalInputValue, setModalInputValue] = useState({});
  const [weekArrayList, setWeekArrayList] = useState([]);
  
  useEffect(() => {
    if (arrayList) {
      const key = lightFormat(new Date(selectedDate), "yyyy-MM-dd");
      localStorage.setItem(key, JSON.stringify(arrayList));
    }
  }, [arrayList]);

  useEffect(() => {
    const key = lightFormat(new Date(selectedDate), "yyyy-MM-dd");
    const savedList = localStorage.getItem(key);
    if (savedList) {
      setArrayList(JSON.parse(savedList));
    } else {
      setArrayList([]);
    }
  }, [selectedDate]);

  useEffect(()=>{
    let tempWeekArrayList = [];
    const weekStart = startOfWeek(new Date(selectedDate), { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      let currentDate = addDays(weekStart, i);
      let formattedDate = lightFormat(currentDate, "yyyy-MM-dd");
      const storedList = localStorage.getItem(formattedDate);
      tempWeekArrayList.push(storedList ? JSON.parse(storedList) : []);
    }
    setWeekArrayList(tempWeekArrayList);
  },[selectedDate,arrayList])

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        selectedView,
        setSelectedView,
        arrayList,
        setArrayList,
        displayModal,
        setDisplayModal,
        modalInputValue,
        setModalInputValue,
        weekArrayList,
        setWeekArrayList,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  return useContext(CalendarContext);
};

