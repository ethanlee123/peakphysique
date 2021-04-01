import { displayBookInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";

displayBookInfo();

// get trainerID from Book Appointment button on profile page
// let trainerID = localStorage.getItem("trainerID");
// trainerID = JSON.parse(trainerID);
// console.log(trainerID.availability);

// initial message from client
const comments = document.getElementById("comments");
const timeSlot = document.getElementById("time-slot");
let date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn");

confirmBtn.addEventListener("click", function(event) {
    event.preventDefault();
    writeAppointmentSchedule(comments, timeSlot, date);
})

const availabilityTest2 = {
  sunday: ["morning"],
  monday: ["afternoon"],
  tuesday: [],
  wednesday: ["morning", "afternoon"],
  thursday: [],
  friday: ["afternoon", "evening"],
  saturday: ["morning", "afternoon", "evening"]
};

console.log(date.value);
console.log(timeSlot.value);

function createTimeSlots(){
    const morning = document.createElement('option');
    morning.setAttribute("value", "1");
    morning.text = "morning";

    const afternoon = document.createElement('option');
    afternoon.setAttribute("value", "2");
    afternoon.text = "afternoon";

    const evening = document.createElement('option');
    evening.setAttribute("value", "3");
    evening.text = "evening";

    $("#time-slot").after(morning, afternoon, evening); 
    
    for (const item in generateUnavailableSlots({availability: availabilityTest2})) {
        if (generateUnavailableSlots.date == date.value){
            if (generateUnavailableSlots.time == "morning"){
                morning.parentNode.removeChild(morning);
            }
            if (generateUnavailableSlots.time == "afternoon"){
                afternoon.parentNode.removeChild(afternoon);
            }
            if (generateUnavailableSlots.time == "evening"){
                evening.parentNode.removeChild(evening);
            }
        }  
    }  
}

createTimeSlots();
