let prevBtn= document.getElementById('prev-month');
let nextBtn= document.getElementById('next-month');
let monthYearDisplay= document.getElementById('month-year');
let setDateBtn = document.getElementById('set-date-btn');
let setDateInput = document.getElementById('set-date-input');
let calendarGrid = document.querySelector('.calendar-grid');

let currentDate = new Date();
console.log(currentDate);

window.addEventListener("load", (event)=>{
    console.log("page is fully loaded");
    updateMonthYear();
    displayCalender();
})

function formatMonthYear(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
}

function updateMonthYear() {
    monthYearDisplay.textContent = formatMonthYear(currentDate);
}

prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1); 
    console.log(currentDate);
    updateMonthYear(); 
    displayCalender();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    console.log(currentDate);
    updateMonthYear();
    displayCalender();
});

setDateBtn.addEventListener('click', () => {
    const dateInput = setDateInput.value.trim();
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateInput.match(regex);
    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);
        if(month<0 || month>11 || day<=0 || day>31){
            alert("Invalid day or month. Please try again");
        }
        else{
            const newDate = new Date(year, month, day);
            if (!isNaN(newDate.getTime())) {
                currentDate = newDate; 
                console.log("Selected Date:", currentDate);
                localStorage.setItem('selectedDate', currentDate.toISOString());
                updateMonthYear();
                displayCalender();
            } else {
                alert("Invalid date. Please try again.");
            }
        }
    } else {
        alert("Please enter a date in the format dd/mm/yyyy.");
    }
    setDateInput.value = '';
});

function displayCalender(){
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const existingDays = calendarGrid.querySelectorAll('.day');
    existingDays.forEach(day => day.remove());

    let count=0;
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'empty');
        calendarGrid.appendChild(emptyDiv);
        count++;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;
        calendarGrid.appendChild(dayDiv);
        count++;
    }
    
    let size;
    if(count<=35) size= 35-count;
    else size= 42-count;
    for (let i = 0; i < size; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'empty');
        calendarGrid.appendChild(emptyDiv);
        count++;
    }
}

let firstClick = false;
let clickTimeout = null;

calendarGrid.addEventListener('click', function(event) {
    if (event.target.classList.contains('day') && !event.target.classList.contains('empty')) {
        const selectedDay = parseInt(event.target.textContent);
        currentDate.setDate(selectedDay);
        console.log("Selected Date:", currentDate);
        localStorage.setItem('selectedDate', currentDate.toISOString());
        if (!firstClick) {
            firstClick = true;
            clickTimeout = setTimeout(() => {
                firstClick = false;
                displayCalender();
            }, 300); 
        }
    }
});
calendarGrid.addEventListener('dblclick', function(event) {
    if (event.target.classList.contains('day') && !event.target.classList.contains('empty')) {
        const selectedDay = parseInt(event.target.textContent);
        currentDate.setDate(selectedDay);
        console.log("Selected Date doubleclick:", currentDate);
        clearTimeout(clickTimeout);
        if (firstClick) {
            localStorage.setItem('selectedDate', currentDate.toISOString());
            window.location.href = "day.html";
        }
    }
});

document.getElementById('view-select').addEventListener('change', function() {
    const selectedView = this.value;
    console.log(selectedView);
    if (selectedView) {
        window.location.href = `${selectedView}.html`;
    }
});
