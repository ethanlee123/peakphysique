import { displayBookInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";

displayBookInfo();

// get trainerID from Book Appointment button on profile page
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);
console.log(trainerID.availability);

// initial message from client
const comments = document.getElementById("comments");
const timeSlot = document.getElementById("time-slot");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn");

confirmBtn.addEventListener("click", function(event) {
    event.preventDefault();
    writeAppointmentSchedule(comments, timeSlot, date);
})

// function getTrainerAvailability() {
//     trainerOnlyRef.doc(localStorage.getItem("trainerProfileToDisplay")).get()
//     .then((doc) => {
//         var availability = doc.data().availability;
//         console.log(availability);
//         return availability;
//     });
// }

function createTimeSlots(date){
    var morning = document.createElement('option');
    morning.setAttribute("value", "1");
    morning.text = "morning";

    var afternoon = document.createElement('option');
    afternoon.setAttribute("value", "2");
    afternoon.text = "afternoon";

    var evening = document.createElement('option');
    evening.setAttribute("value", "3");
    evening.text = "evening";

    $("#time-slot").after(morning, afternoon, evening); 
    
    for (const item in generateUnavailableSlots(trainerID.availability)) {
        if (generateUnavailableSlots[item][0] == date){
            if (generateUnavailableSlots[item][1] == "morning"){
                morning.parentNode.removeChild(morning);
            }
            if (generateUnavailableSlots[item][1] == "afternoon"){
                afternoon.parentNode.removeChild(afternoon);
            }
            if (generateUnavailableSlots[item][1] == "evening"){
                evening.parentNode.removeChild(evening);
            }
        }  
    }  
}

createTimeSlots();



