import { displayScheduleInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { getTemplate } from "../util/getTemplate.js";

// initial message from client
const comments = document.getElementById("comments");
const timeSlot = document.getElementById("time-slot");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn")

// confirmBtn.addEventListener("click", function(event) {
//     event.preventDefault();
//     writeAppointmentSchedule(comments, timeSlot, date);
// })

// #### displayScheduleInfo variables
const trainerFirstName = document.getElementById('trainerFirstName');
const trainerLastName = document.getElementById('trainerLastName');
const apptTime = document.getElementById('appt-time');
const apptDate = document.getElementById('appt-date');

// displayScheduleInfo(trainerFirstName, trainerLastName, apptTime, apptDate);
// using renderScheduleCards instead


// ##########   renderScheduleCards Variables
const scheduleCardPath = "../../common/schedule-card.html";
const scheduleCardTemplate = await getTemplate(scheduleCardPath);
const scheduleList = document.getElementById("scheduleList");
const scheduleCompletedList = document.getElementById("scheduleCompletedList");
const db = firebase.firestore();
const scheduleCollection = await db.collection("schedule").get();

// inserts text inside cards
const insertText = (parentNode, selector, text) => {
    const element = parentNode.querySelector(selector);
    element.appendChild(document.createTextNode(text));
}

// creates upcoming schedule cards based on firestore "schedule" collection
const renderScheduleCards = () => {
    scheduleList.innerHTML = "";

    db.collection("schedule").where("completed", "==", false)
    .get()
    .then(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().trainerFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().trainerLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date.toDate().toDateString());
        insertText(scheduleCard, "#appt-time", schedule.data().time);

        const cancelAppt = scheduleCard.querySelector(".cancelBtn");
        cancelAppt.addEventListener("click", () => {
            schedule.ref.update({completed: true})
        });

        scheduleList.appendChild(scheduleCard);
        })
    });
}
renderScheduleCards();

// sets appointment to completed in firestore if date is passed
const completeAppt = () => {
    var todayDate = new Date();

    db.collection("schedule").get()
    .then(function(s) {
        s.forEach(schedule => {
            if (schedule.data().date.toDate() < todayDate) {
                schedule.ref.update({completed: true})
            }
        })
    });
}
completeAppt();

// moves completed schedule cards to completed based on firestore "schedule" collection
const renderCompletedScheduleCards = () => {
    scheduleCompletedList.innerHTML = "";

    db.collection("schedule")
    .where("completed", "==", true)
    .orderBy("date", "asc")
    .get()
    .then(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().trainerFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().trainerLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date.toDate().toDateString());
        insertText(scheduleCard, "#appt-time", schedule.data().time);

        scheduleCompletedList.appendChild(scheduleCard);

        })
    })  
    .then(() => {
        let cancelBtn = scheduleCompletedList.getElementsByClassName("hideScheduleBtn");
        
        console.log(cancelBtn.length);
        for (let i = 0; i < cancelBtn.length; i++) {
            cancelBtn[i].style.display = "none";
            }
        })    
}  
renderCompletedScheduleCards();







const cancelBtn = document.getElementsByClassName("cancelBtn");
const trainerName = document.getELements

// cancelBtn.addEventListener("click", function(e) {
    

// }