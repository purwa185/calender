let dateshow = document.getElementById("showing-date");
const scrollBox = document.querySelector(".scroll-box");
const modal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");
const saveEventBtn = document.getElementById("saveEvent");
const deleteEventBtn = document.getElementById("deleteEvent");
let arrayList = [];
//arraylist ->array of objects [{Time:0/1/2/3/......,Event Name:   , Event Descriotion: }, ];

let selectedTimeSlot = null; //-->gives the entire div.
let selectedDate; //date obj

window.addEventListener("DOMContentLoaded", function () {
  const sd = localStorage.getItem("selectedDate");
  if (sd) {
    selectedDate = new Date(sd);
    console.log("Selected Date from localStorage:", selectedDate);
  }
  showDate();
  loadList();
  displayEvent();
});

//formating the date
function formatDateForKey(date) {
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

//adding it to the local storage
function saveList() {
  const dateKey = formatDateForKey(selectedDate);
  localStorage.setItem(dateKey, JSON.stringify(arrayList));
}

//fetching the arrayList from the local storage
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

scrollBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("hourlyTimeSlots")) {
    selectedTimeSlot = e.target;
    console.log(selectedTimeSlot);
    modal.style.display = "block";
    if (selectedTimeSlot.classList.contains("booked")) {
      const eventName = selectedTimeSlot.getAttribute("data-event-name") || "";
      const eventDescription =
        selectedTimeSlot.getAttribute("data-event-description") || "";
      document.getElementById("eventName").value = eventName;
      document.getElementById("eventDescription").value = eventDescription;
    } else {
      document.getElementById("eventName").value = "";
      document.getElementById("eventDescription").value = "";
    }
  }
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

saveEventBtn.addEventListener("click", () => {
  if (selectedTimeSlot) {
    const eventName = document.getElementById("eventName").value; 
    const eventDescription = document.getElementById("eventDescription").value; 
    const timeText = selectedTimeSlot.firstChild.textContent.trim();
    let eventDetailsContainer = selectedTimeSlot.querySelector(".event-details");
    if (!eventDetailsContainer) {
      eventDetailsContainer = document.createElement("div");
      eventDetailsContainer.classList.add("event-details");
      selectedTimeSlot.appendChild(eventDetailsContainer);
    } else {
      eventDetailsContainer.innerHTML = "";
    }
    const eventNameElement = document.createElement("h4");
    eventNameElement.textContent = eventName;
    const eventDescriptionElement = document.createElement("p");
    eventDescriptionElement.textContent = eventDescription;
    eventDetailsContainer.appendChild(eventNameElement);
    eventDetailsContainer.appendChild(eventDescriptionElement);
    selectedTimeSlot.innerHTML = "";
    selectedTimeSlot.textContent = timeText;
    selectedTimeSlot.appendChild(eventDetailsContainer);
    selectedTimeSlot.classList.add("booked");
    modal.style.display = "none";
    addToList(eventName, eventDescription);
  }
});

//adding to the arraylist.
function addToList(eventName, eventDescription) {
  const eventIndex = arrayList.findIndex(
    (event) => event.time === selectedTimeSlot.dataset.time
  );
  if (eventIndex === -1) {
    arrayList.push({
      time: selectedTimeSlot.dataset.time,
      eventname: eventName,
      eventdescription: eventDescription,
    });
  } else {
    arrayList[eventIndex].eventname = eventName;
    arrayList[eventIndex].eventdescription = eventDescription;
  }
  saveList();
}

function displayEvent() {
  const scrollBox = document.querySelector(".scroll-box");
  scrollBox.innerHTML = "";
  for (let i = 0; i < 48; i++) {
    const timeText = `${String(Math.floor(i / 2)).padStart(2, "0")}:${
      i % 2 === 0 ? "00" : "30"
    }`;  //working
    const existingEvent = arrayList.find((event) => event.time == i);  
    console.log(existingEvent);
    const timeSlot = document.createElement("div");
    timeSlot.classList.add("hourlyTimeSlots");
    timeSlot.setAttribute("data-time", i);
    timeSlot.textContent = timeText;
    if (existingEvent) {
      const eventDetailsContainer = document.createElement("div");
      eventDetailsContainer.classList.add("event-detail");
      const eventNameElement = document.createElement("h4");
      eventNameElement.textContent = existingEvent.eventname;
      const eventDescriptionElement = document.createElement("p");
      eventDescriptionElement.textContent = existingEvent.eventdescription;
      eventDetailsContainer.appendChild(eventNameElement);
      eventDetailsContainer.appendChild(eventDescriptionElement);
      timeSlot.innerHTML = "";
      timeSlot.appendChild(document.createTextNode(timeText));
      timeSlot.appendChild(eventDetailsContainer);
      timeSlot.classList.add("booked");
    }
    scrollBox.appendChild(timeSlot);
  }
}

deleteEventBtn.addEventListener("click", () => {
  if (selectedTimeSlot) {
    const timeText = selectedTimeSlot.firstChild.textContent.trim();
    selectedTimeSlot.innerHTML = "";
    selectedTimeSlot.textContent = timeText;
    selectedTimeSlot.classList.remove("booked");
    const selectedTime = parseInt(selectedTimeSlot.getAttribute("data-time"));
    arrayList = arrayList.filter(event => event.time != selectedTime);
    modal.style.display = "none";
    saveList();
  }
});

// Close modal if clicked outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function showDate() {
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
  let year = selectedDate.getFullYear();
  let month = selectedDate.getMonth();
  let date = selectedDate.getDate();
  console.log(months[month], year, date);
  const spann = document.createElement("span");
  spann.textContent = `${months[month]} ${date} , ${year}`;
  dateshow.appendChild(spann);
}
