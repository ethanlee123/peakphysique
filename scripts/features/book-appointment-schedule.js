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

// creates timeslots for selected date
function createTimeSlots() {
    db.collection("trainerAvailability").get()
    .then(function (q) {
        q.forEach(function (doc) {
            // unavailability is an array of dates: dd MM yyyy
            var unavailability = doc.data();
            console.log(unavailability);
            // check each date for available timeslots to dynamically create dropdown selections
            var timeSlot = $(unavailability).find('timeSlot').each(function(){
                if(timeSlot != "Morning"){
                    var morning = document.createElement('option');
                    $('option').text("Morning");
                    $("#timeSlots").append(morning);
                }
                if(timeSlot != "Afternoon"){
                    var afternoon = document.createElement('option');
                    $('option').text("Afternoon");
                    $("#timeSlots").append(afternoon);
                }
                if(timeSlot != "Evening"){
                    var evening = document.createElement('option');
                    $('option').text("Evening");
                    $("#timeSlots").append(evening);
                }
                });
        })
    })
    
}

createTimeSlots();