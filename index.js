let prevMonthButton = document.getElementById("prev-month");
let nextMonthButton = document.getElementById("next-month");
let displayDate = document.getElementById("display-date");
let calendarGrid = document.querySelector(".calendar-grid");
let displayMY = document.getElementById("month-year");
let container = document.getElementById("content");
let modal = document.getElementById("eventModal");
let modal2 = document.getElementById("eventModal2");
let modal3 = document.getElementById("eventModal3");
let addeventbtn = document.querySelector(".addeventbtn");
let closeModal = document.getElementById("closeModal");
let closeModal2 = document.getElementById("closeModal2");
let closeModal3 = document.getElementById("closeModal3");
let startTimeInput2 = document.getElementById("eventStartTime2");
let endTimeInput2 = document.getElementById("eventEndTime2");
let eventNameInput2 = document.getElementById("eventName2");
let eventDescInput2 = document.getElementById("eventDescription2");
let selectedTimeSlotWeek = null;
let arrayLists = {};
let weekDates = [];
let currentDate = new Date();
let selectedDate = new Date();
let selectedTimeSlot = null;
let arrayList = [];

//Moved months outside as it's constant for 1 or more function
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  displayDateInNavbar();
  displayCalender();
  renderView("month-view");
  loadList();
});

function saveList() {
  const dateKey = formatDateForKey(selectedDate);
  localStorage.setItem(dateKey, JSON.stringify(arrayList));
}

function loadList() {
  arrayList = [];
  try {
    const dateKey = formatDateForKey(selectedDate);
    const savedList = localStorage.getItem(dateKey);
    if (savedList) {
      arrayList = JSON.parse(savedList);
    }
  } catch (error) {
    console.error("Error while fetching list from localStorage!: ", error);
  }
}
function formatDateForKey(date) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatMonthYearDay(date) {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}
function formatMonthYear(date) {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
}
function displayDateInNavbar() {
  displayDate.textContent = formatMonthYearDay(selectedDate);
}
function displayDateInCalendar() {
  displayMY.textContent = formatMonthYear(selectedDate);
}

prevMonthButton.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  displayDateInCalendar();
  displayCalender();
});

nextMonthButton.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  displayDateInCalendar();
  displayCalender();
});

//add comment
function displayCalender() {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  //This gives us the first Day of the month Sunday = 0, Monday = 1, ...
  const firstDayOfTheMonth = new Date(year, month, 1).getDay();
  //This gives us the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const existingDays = calendarGrid.querySelectorAll(".day");
  existingDays.forEach((day) => day.remove());

  //the cells before the first day of the month will be empty cells
  //For example if first day is Friday=5 so 5 cells before friday will be empty
  //So the first for loop is for the empty cells.
  for (let i = 0; i < firstDayOfTheMonth; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("day");
    calendarGrid.appendChild(emptyDiv);
  }
  //The second for loop is to insert the dates in the div.
  for (let day = 1; day <= daysInMonth; day++) {
    let compareSelectedDate = formatDateForKey(selectedDate);
    let compareCurrentDate = formatDateForKey(currentDate);
    let nowDate = `${day}/${month}/${year}`;
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    if (compareSelectedDate === nowDate) {
      dayDiv.classList.add("selected-date");
    }
    if (compareSelectedDate === nowDate) {
      dayDiv.classList.add("current-date");
    }
    dayDiv.textContent = day;
    calendarGrid.appendChild(dayDiv);
  }
}

document.getElementById("views").addEventListener("change", function () {
  const selectedView = this.value;
  renderView(selectedView);
});

function renderView(view) {
  const container = document.getElementById("content");
  if (view == "day-view") {
    container.innerHTML = "";
    const scrollBox = document.createElement("div");
    scrollBox.classList.add("scroll-box");

    scrollBox.innerHTML = "";

    for (let i = 0; i < 48; i++) {
      const hour24 = Math.floor(i / 2);
      const minute = i % 2 === 0 ? "00" : "30";
      const ampm = hour24 >= 12 ? "PM" : "AM";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      const timeText = `${String(hour12).padStart(2, "0")}:${minute} ${ampm}`;

      const timeSlot = document.createElement("div");
      timeSlot.classList.add("hourlyTimeSlots");
      timeSlot.setAttribute("data-time", i);

      const timeSpan = document.createElement("span");
      timeSpan.classList.add("time-span");
      timeSpan.textContent = timeText;
      timeSlot.appendChild(timeSpan);

      const existingEvent = arrayList.find((event) => event.time == i);

      if (existingEvent) {
        const eventDetailsContainer = document.createElement("div");
        eventDetailsContainer.classList.add("event-detail");
        const eventNameElement = document.createElement("span");
        eventNameElement.classList.add("dayTimeSlotEN");
        eventNameElement.textContent = `Event Name - ${existingEvent.eventName}`;
        const eventDescriptionElement = document.createElement("span");
        eventDescriptionElement.classList.add("dayTimeSlotED");
        eventDescriptionElement.textContent = `Event Description - ${existingEvent.eventDescription}`;
        eventDetailsContainer.appendChild(eventNameElement);
        eventDetailsContainer.appendChild(eventDescriptionElement);
        // timeSlot.innerHTML = "";
        timeSlot.appendChild(eventDetailsContainer);
        timeSlot.classList.add("booked");
      }
      scrollBox.appendChild(timeSlot);
    }
    container.appendChild(scrollBox);
  } else if (view == "week-view") {
    container.innerHTML = "";
    // Adding Dates of the entire week
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    const weekHeader = document.createElement("div");
    weekHeader.classList.add("week-header");
    weekHeader.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDates.push(new Date(day));
      const dayElement = document.createElement("div");
      dayElement.classList.add("day-box");
      dayElement.textContent = `${day.toLocaleDateString("en-US", {
        weekday: "short",
      })} ${day.getDate()}`;
      weekHeader.appendChild(dayElement);
    }
    container.appendChild(weekHeader);

    let arrInd = 0;
    weekDates.forEach((date) => {
      const dateKey = formatDateForKey(date);
      let storedData = JSON.parse(localStorage.getItem(dateKey)) || [];
      arrayLists[arrInd] = storedData;
      arrInd++;
    });
    const scrollBox = document.createElement("div");
    scrollBox.classList.add("scroll-box-week");
    scrollBox.innerHTML = "";
    let ind = 0;
    for (let i = 0; i < 48 * 7; i++) {
      let timeText = "";
      if (i % 7 === 0) {
        const hour24 = Math.floor(ind / 2);
        const minute = ind % 2 === 0 ? "00" : "30";
        const ampm = hour24 >= 12 ? "PM" : "AM";
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
        timeText = `${String(hour12).padStart(2, "0")}:${minute} ${ampm}`;
        ind++;
      }
      const dayIndex = i % 7;
      const timeIndex = Math.floor(i / 7);
      const timeSlot = document.createElement("div");
      timeSlot.classList.add("hourlyTimeSlots-week");
      timeSlot.setAttribute("data-index", dayIndex);
      timeSlot.setAttribute("data-date", formatDateForKey(weekDates[dayIndex]));
      timeSlot.setAttribute("data-time-slot", timeIndex);

      let tempArray = arrayLists[dayIndex];
      const hasEvent = tempArray.find((event) => event.time == timeIndex);
      if (hasEvent) {
        const eventDetailsContainer = document.createElement("div");
        eventDetailsContainer.classList.add("event-detail");
        const eventNameElement = document.createElement("span");
        eventNameElement.classList.add("weekTimeSlotEN");
        eventNameElement.textContent = `Event Name - ${hasEvent.eventName}`;
        const eventDescriptionElement = document.createElement("span");
        eventDescriptionElement.classList.add("weekTimeSlotED");
        eventDescriptionElement.textContent = `Event Description - ${hasEvent.eventDescription}`;
        eventDetailsContainer.appendChild(eventNameElement);
        eventDetailsContainer.appendChild(eventDescriptionElement);
        timeSlot.appendChild(eventDetailsContainer);
        timeSlot.classList.add("booked");
      }

      const timeSpan = document.createElement("span");
      timeSpan.classList.add("time-span");
      timeSpan.textContent = timeText;
      timeSlot.appendChild(timeSpan);
      scrollBox.appendChild(timeSlot);
    }
    container.appendChild(scrollBox);
  } else if (view == "month-view") {
    container.innerHTML = "";
    const containerCalender = document.createElement("div");
    containerCalender.className = "container-calender";
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const existingDays = calendarGrid.querySelectorAll(".calendar-day");
    existingDays.forEach((day) => day.remove());

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let k = 0;
    let count = 0;
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("calendar-day");
      if (k <= 7) {
        const dayName = document.createElement("span");
        dayName.classList.add("day-name", "empty");
        dayName.textContent = daysOfWeek[k];
        emptyDiv.appendChild(dayName);
        k++;
      }
      containerCalender.appendChild(emptyDiv);
      count++;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      let key = formatDateForKey(new Date(year, month, day));
      let tempArr = [];
      let sL = localStorage.getItem(key);
      if (sL) {
        tempArr = JSON.parse(sL);
      }
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("calendar-day");
      if (k <= 7) {
        const dayName = document.createElement("span");
        dayName.classList.add("day-name");
        dayName.textContent = daysOfWeek[k];
        dayDiv.appendChild(dayName);
        k++;
      }
      const dateSpan = document.createElement("span");
      dateSpan.classList.add("date");
      dateSpan.textContent = day;
      dayDiv.appendChild(dateSpan);
      if (tempArr.length) {
        const countEvent = document.createElement("span");
        countEvent.classList.add("badge");
        countEvent.textContent = tempArr.length;
        dayDiv.appendChild(countEvent);
      }
      containerCalender.appendChild(dayDiv);
      count++;
    }
    let size;
    if (count <= 35) size = 35 - count;
    else size = 42 - count;
    for (let i = 0; i < size; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("calendar-day", "empty");
      containerCalender.appendChild(emptyDiv);
      count++;
    }
    container.appendChild(containerCalender);
  }
}

calendarGrid.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("day") &&
    !event.target.classList.contains("empty")
  ) {
    const selectedDay = parseInt(event.target.textContent);
    selectedDate.setDate(selectedDay);
    console.log("Selected Date:", selectedDate);
    loadList();
    renderView("day-view");
    localStorage.setItem("selectedDate", selectedDate.toISOString());
  }
});

addeventbtn.addEventListener("click", function () {
  modal.style.display = "block";
});

// Close the modal when the close button is clicked
closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
  if (event.target === modal2) {
    modal2.style.display = "none";
  }
  if (event.target === modal3) {
    modal3.style.display = "none";
  }
});

document
  .getElementById("eventForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventDescription = document.getElementById("eventDescription").value;
    const eventStartTime = document.getElementById("eventStartTime").value;
    const eventEndTime = document.getElementById("eventEndTime").value;

    function isValidHalfHour(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return minutes === 0 || minutes === 30;
    }

    if (!isValidHalfHour(eventStartTime) || !isValidHalfHour(eventEndTime)) {
      alert("Please select a valid half-hourly slot (e.g., 2:30 or 4:00).");
      return;
    }
    if (eventEndTime <= eventStartTime) {
      alert("End time must be greater than start time.");
      return;
    }
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
    const startTimeInMinutes = timeToMinutes(eventStartTime);
    const endTimeInMinutes = timeToMinutes(eventEndTime);
    const duration = endTimeInMinutes - startTimeInMinutes;

    if (duration !== 30) {
      alert("The event duration must be exactly 30 minutes.");
      return;
    }
    const eventTimeSlot = getTimeSlot(eventStartTime);
    arrayList.push({
      time: eventTimeSlot,
      eventName: eventName,
      eventDescription: eventDescription,
    });
    modal.style.display = "none";
    saveList();
  });
function getTimeSlot(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  return Math.floor(totalMinutes / 30);
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("hourlyTimeSlots")) {
    selectedTimeSlot = e.target;
    const selectedTime = selectedTimeSlot.getAttribute("data-time");
    if (!isNaN(selectedTime)) {
      const { start, end } = getTimeRange(selectedTime);
      startTimeInput2.value = start;
      endTimeInput2.value = end;
    }
    if (selectedTimeSlot.classList.contains("booked")) {
      const eventName =
        selectedTimeSlot.querySelector(".dayTimeSlotEN")?.textContent.trim() ||
        "";
      const eventDesc =
        selectedTimeSlot.querySelector(".dayTimeSlotED")?.textContent.trim() ||
        "";
      eventNameInput2.value = eventName.replace("Event Name - ", "");
      eventDescInput2.value = eventDesc.replace("Event Description - ", "");
    } else {
      eventNameInput2.value = "";
      eventDescInput2.value = "";
    }
    modal2.style.display = "block";
  }
});

function getTimeRange(slotIndex) {
  const minutesPerSlot = 30;
  const startMinutes = slotIndex * minutesPerSlot;

  const startHour = Math.floor(startMinutes / 60);
  const startMin = startMinutes % 60;

  const endHour = Math.floor((startMinutes + minutesPerSlot) / 60);
  const endMin = (startMinutes + minutesPerSlot) % 60;

  const startTime = `${startHour.toString().padStart(2, "0")}:${startMin
    .toString()
    .padStart(2, "0")}`;
  const endTime = `${endHour.toString().padStart(2, "0")}:${endMin
    .toString()
    .padStart(2, "0")}`;

  return { start: startTime, end: endTime };
}

closeModal2.addEventListener("click", function () {
  modal2.style.display = "none";
});

document
  .getElementById("eventForm2")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const eventName = document.getElementById("eventName2").value;
    const eventDescription = document.getElementById("eventDescription2").value;
    const eventStartTime = document.getElementById("eventStartTime2").value;
    const eventEndTime = document.getElementById("eventEndTime2").value;
    function isValidHalfHour(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return minutes === 0 || minutes === 30;
    }
    if (!isValidHalfHour(eventStartTime) || !isValidHalfHour(eventEndTime)) {
      alert("Please select a valid half-hourly slot (e.g., 2:30 or 4:00).");
      return;
    }
    if (eventEndTime <= eventStartTime) {
      alert("End time must be greater than start time.");
      return;
    }
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
    const startTimeInMinutes = timeToMinutes(eventStartTime);
    const endTimeInMinutes = timeToMinutes(eventEndTime);
    const duration = endTimeInMinutes - startTimeInMinutes;

    if (duration !== 30) {
      alert("The event duration must be exactly 30 minutes.");
      return;
    }
    const eventTimeSlot = getTimeSlot(eventStartTime);
    const existingEventIndex = arrayList.findIndex(
      (event) => event.time === eventTimeSlot
    );
    if (existingEventIndex !== -1) {
      arrayList[existingEventIndex].eventName = eventName;
      arrayList[existingEventIndex].eventDescription = eventDescription;
    } else {
      arrayList.push({
        time: eventTimeSlot,
        eventName: eventName,
        eventDescription: eventDescription,
      });
    }
    modal2.style.display = "none";
    saveList();
    renderView("day-view");
  });

function deleteEvent(timeToDelete) {
  const index = arrayList.findIndex((event) => event.time == timeToDelete);
  if (index !== -1) {
    arrayList.splice(index, 1);
  } else {
    alert("Event not found!");
  }
}

document
  .querySelector(".delete-button2")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const timeToDelete = getTimeSlot(
      document.getElementById("eventStartTime2").value
    );
    console.log(timeToDelete);
    console.log(arrayList);
    if (timeToDelete) {
      deleteEvent(timeToDelete);
    } else {
      alert("Please enter a valid event start time.");
    }
    saveList();
    modal2.style.display = "none";
    renderView("day-view");
  });

container.addEventListener("click", function (e) {
  if (e.target.classList.contains("hourlyTimeSlots-week")) {
    selectedTimeSlotWeek = e.target;
    const eventNameInput3 = document.getElementById("eventName3");
    const eventDescriptionInput3 = document.getElementById("eventDescription3");
    const startTimeInput3 = document.getElementById("eventStartTime3");
    const endTimeInput3 = document.getElementById("eventEndTime3");
    console.log(selectedTimeSlotWeek);
    if (!selectedTimeSlotWeek) return;
    const selectedSlotDate = selectedTimeSlotWeek.getAttribute("data-date");
    const selectedTime = selectedTimeSlotWeek.getAttribute("data-time-slot");
    const selectedDataIndex = selectedTimeSlotWeek.getAttribute("data-index");
    const tempArr = arrayLists[selectedDataIndex];
    if (!isNaN(selectedTime)) {
      const { start, end } = getTimeRange(selectedTime);
      startTimeInput3.value = start;
      endTimeInput3.value = end;
    }
    if (selectedTimeSlotWeek.classList.contains("booked")) {
      const eventName =
        selectedTimeSlotWeek
          .querySelector(".weekTimeSlotEN")
          ?.textContent.trim() || "";
      const eventDesc =
        selectedTimeSlotWeek
          .querySelector(".weekTimeSlotED")
          ?.textContent.trim() || "";
      eventNameInput3.value = eventName.replace("Event Name - ", "");
      eventDescriptionInput3.value = eventDesc.replace(
        "Event Description - ",
        ""
      );
    } else {
      eventNameInput3.value = "";
      eventDescriptionInput3.value = "";
    }
    modal3.style.display = "block";
  }
});

closeModal3.addEventListener("click", function () {
  modal3.style.display = "none";
});

document
  .getElementById("eventForm3")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const eventName = document.getElementById("eventName3").value;
    const eventDescription = document.getElementById("eventDescription3").value;
    const eventStartTime = document.getElementById("eventStartTime3").value;
    const eventEndTime = document.getElementById("eventEndTime3").value;
    function isValidHalfHour(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return minutes === 0 || minutes === 30;
    }
    if (!isValidHalfHour(eventStartTime) || !isValidHalfHour(eventEndTime)) {
      alert("Please select a valid half-hourly slot (e.g., 2:30 or 4:00).");
      return;
    }
    if (eventEndTime <= eventStartTime) {
      alert("End time must be greater than start time.");
      return;
    }
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
    const startTimeInMinutes = timeToMinutes(eventStartTime);
    const endTimeInMinutes = timeToMinutes(eventEndTime);
    const duration = endTimeInMinutes - startTimeInMinutes;
    if (duration !== 30) {
      alert("The event duration must be exactly 30 minutes.");
      return;
    }
    const eventTimeSlot = selectedTimeSlotWeek.getAttribute("data-time-slot");
    console.log(eventTimeSlot);
    const dayIndex = selectedTimeSlotWeek.getAttribute("data-index");
    console.log(dayIndex);
    const tempArr = arrayLists[dayIndex];
    console.log(tempArr);
    const existingEventIndex = tempArr.findIndex(
      (event) => event.time === eventTimeSlot
    );
    if (existingEventIndex !== -1) {
      tempArr[existingEventIndex].eventName = eventName;
      tempArr[existingEventIndex].eventDescription = eventDescription;
    } else {
      tempArr.push({
        time: eventTimeSlot,
        eventName: eventName,
        eventDescription: eventDescription,
      });
    }

    modal3.style.display = "none";
    const dateKey = selectedTimeSlotWeek.getAttribute("data-date");
    localStorage.setItem(dateKey, JSON.stringify(tempArr));
    renderView("week-view");
  });
