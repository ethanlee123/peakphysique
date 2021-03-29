import { displayBookInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";

const db = firebase.firestore();

displayBookInfo();

// initial message from client
const comments = document.getElementById("comments");
const timeSlot = document.getElementById("time-slot");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn")

confirmBtn.addEventListener("click", function(event) {
    event.preventDefault();
    writeAppointmentSchedule(comments, timeSlot, date);
})

function getTrainerAvailability() {
    trainerOnlyRef.doc(localStorage.getItem("trainerProfileToDisplay")).get()
    .then((doc) => {
        var availability = doc.data().availability;
        console.log(availability);
        return availability;
    });
}

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
    
    for (const item in generateUnavailableSlots()) {
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

// creates timeslots for selected date
// function createTimeSlots(date) {
//     db.collection("trainerUnavailability").where("trainerUserId", "==", user.uid).get()
//     .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//             // unavailability is an array of dates: dd MM yyyy
//             var unavailability = doc.data();
//             console.log(unavailability);
//             // check each date for available timeslots to dynamically create dropdown selections
//             var timeSlot = $(unavailability).find(date.value).each(function(){
//                 if(timeSlot != "evening"){
//                     var evening = document.createElement('option');
//                     $('option').text("evening");
//                     $("#time-slot").append(evening);
//                 }
//                 if(timeSlot != "afternoon"){
//                     var afternoon = document.createElement('option');
//                     $('option').text("afternoon");
//                     $("#time-slot").append(afternoon);
//                 }
//                 if(timeSlot != "morning"){
//                     var morning = document.createElement('option');
//                     $('option').text("morning");
//                     $("#time-slot").append(morning);
//                 }
//             });
//         })
//     })    
// }

// generateUnavailableSlots.forEach(time => {
//     if (time == "morning"){
//         morning.parentNode.removeChild(morning);
//     } else if (time == "afternoon"){
//         afternoon.parentNode.removeChild(afternoon);
//     } else {
//         evening.parentNode.removeChild(evening);
//     }
// });

createTimeSlots();