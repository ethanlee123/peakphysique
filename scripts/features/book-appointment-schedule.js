import { displayScheduleInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";

// initial message from client
const comments = document.getElementById("comments");
const timeSlot = document.getElementById("time-slot");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn")

confirmBtn.addEventListener("click", function(event) {
    event.preventDefault();
    writeAppointmentSchedule(comments, timeSlot, date);
})

// displayScheduleInfo();