let dateshow = document.getElementById("showing-date");
const slots = document.querySelectorAll(".hourlyTimeSlots");
const eventModal = document.getElementById("eventModal");
const closeBtn = document.querySelector(".close-btn");
const eventForm = document.getElementById("eventForm");
let selectedSlot = null;
let selectedDate;

window.addEventListener("DOMContentLoaded", function () {
  const sd = localStorage.getItem("selectedDate");
  if (sd) {
    selectedDate = new Date(sd);
    console.log("Selected Date from localStorage:", selectedDate);
  }
  showDate();
});

// Handle click on slots
slots.forEach((slot) => {
  slot.addEventListener("click", (e) => {
    if (!slot.classList.contains("booked")) {
      selectedSlot = slot;
      eventModal.style.display = "flex";
    } else {
      alert("This slot is already booked!");
    }
  });
});

closeBtn.addEventListener("click", () => {
  eventModal.style.display = "none";
});

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const eventTitle = document.getElementById("eventTitle").value;
  const eventColor = document.getElementById("eventColor").value;
  const startTime = parseInt(document.getElementById("startTime").value);
  const endTime = parseInt(document.getElementById("endTime").value);

  if (startTime >= endTime) {
    alert("End time must be after start time.");
    return;
  }

  if (
    selectedSlot &&
    eventTitle &&
    eventColor &&
    startTime !== "" &&
    endTime !== ""
  ) {
    for (let i = startTime; i < endTime; i++) {
      const slot = document.querySelectorAll(".hourlyTimeSlots")[i];
      if (!slot.classList.contains("booked")) {
        slot.classList.add("booked");
        slot.style.backgroundColor = eventColor;

        const startFormatted = i < 10 ? `0${i}:00` : `${i}:00`;
        const endFormatted = i + 1 < 10 ? `0${i + 1}:00` : `${i + 1}:00`;

        slot.innerHTML = `${eventTitle} (${startFormatted} - ${endFormatted})`;
      }
    }

    eventModal.style.display = "none";
    eventForm.reset();
    selectedSlot = null;
  } else {
    alert(
      "Please provide a title, select a color, and choose valid start and end times!"
    );
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
