let prevBtn = document.getElementById("prev-month");
let nextBtn = document.getElementById("next-month");
let displayDate = document.getElementById("display-date");
let calendarGrid = document.querySelector(".calendar-grid");
let displayMY = document.getElementById("month-year");
// let scrollBox = document.querySelector(".scroll-box");
let container = document.getElementById("content");
let modal = document.getElementById("eventModal");
let modal2 = document.getElementById("eventModal2");
let btn = document.querySelector(".addeventbtn");
let closeModal = document.getElementById("closeModal");
let closeModal2 = document.getElementById("closeModal2");
let selectedDate = new Date();
let selectedTimeSlot = null;
let arrayList = [];

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
  const months = [
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
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}
function formatMonthYear(date) {
  const months = [
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

prevBtn.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  displayDateInCalendar();
  displayCalender();
});

nextBtn.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  displayDateInCalendar();
  displayCalender();
});

function displayCalender() {
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const existingDays = calendarGrid.querySelectorAll(".day");
  existingDays.forEach((day) => day.remove());

  let count = 0;
  for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.classList.add("day");
    calendarGrid.appendChild(emptyDiv);
    count++;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.textContent = day;
    calendarGrid.appendChild(dayDiv);
    count++;
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
      console.log(existingEvent);

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
      const timeSlot = document.createElement("div");
      timeSlot.classList.add("hourlyTimeSlots-week");
      timeSlot.setAttribute("data-time", i);
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

let firstClick = false;
let clickTimeout = null;

calendarGrid.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("day") &&
    !event.target.classList.contains("empty")
  ) {
    const selectedDay = parseInt(event.target.textContent);
    selectedDate.setDate(selectedDay);
    console.log("Selected Date:", selectedDate);
    loadList();
    renderView("month-view");
    localStorage.setItem("selectedDate", selectedDate.toISOString());
    if (!firstClick) {
      firstClick = true;
      clickTimeout = setTimeout(() => {
        firstClick = false;
        displayCalender();
      }, 300);
    }
  }
});

calendarGrid.addEventListener("dblclick", function (event) {
  if (
    event.target.classList.contains("day") &&
    !event.target.classList.contains("empty")
  ) {
    const selectedDay = parseInt(event.target.textContent);
    selectedDate.setDate(selectedDay);
    clearTimeout(clickTimeout);
    if (firstClick) {
      localStorage.setItem("selectedDate", selectedDate.toISOString());
      displayDateInNavbar();
      renderView("day-view");
      const viewSelector = document.getElementById("views");
      if (viewSelector) {
        viewSelector.value = "day-view";
      }
    }
  }
});

btn.addEventListener("click", function () {
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
    function getTimeSlot(time) {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return Math.floor(totalMinutes / 30);
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


container.addEventListener("click", (e) => {
  if (e.target.classList.contains("hourlyTimeSlots")) {
    selectedTimeSlot = e.target;
    modal2.style.display = "block";
  }
});

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
    function getTimeSlot(time) {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return Math.floor(totalMinutes / 30);
    }
    const eventTimeSlot = getTimeSlot(eventStartTime);
    arrayList.push({
      time: eventTimeSlot,
      eventName: eventName,
      eventDescription: eventDescription,
    });
    modal2.style.display = "none";
    saveList();
  });
