window.addEventListener('DOMContentLoaded', function() {
    const selectedDate = localStorage.getItem('selectedDate');
    if (selectedDate) {
        const dateObj = new Date(selectedDate);
        console.log("Selected Date from localStorage:", dateObj);
    }
});
