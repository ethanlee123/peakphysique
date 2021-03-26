import { displayScheduleInfo } from "/scripts/api/firebase-queries.js";


const trainerFirstName = document.getElementById('trainerFirstName');
const trainerLastName = document.getElementById('trainerLastName');
const apptTime = document.getElementById('appt-time');
const apptDate = document.getElementById('appt-date');


displayScheduleInfo(trainerFirstName, trainerLastName, apptTime, apptDate);


const cancelBtn = document.getElementsByClassName("cancelBtn");
const trainerName = document.getELements

// cancelBtn.addEventListener("click", function(e) {
    

// })