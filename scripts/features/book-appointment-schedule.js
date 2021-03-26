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


const trainerFirstName = document.getElementById('trainerFirstName');
const trainerLastName = document.getElementById('trainerLastName');
const apptTime = document.getElementById('appt-time');
const apptDate = document.getElementById('appt-date');


displayScheduleInfo(trainerFirstName, trainerLastName, apptTime, apptDate);


const cancelBtn = document.getElementsByClassName("cancelBtn");
const trainerName = document.getELements

// cancelBtn.addEventListener("click", function(e) {
    

// })