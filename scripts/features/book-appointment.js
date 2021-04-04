import { displayBookInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";

displayBookInfo();

// get trainerID from Book Appointment button on profile page
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);
console.log(trainerID.availability);
console.log(trainerID);

const availabilityTest2 = {
  sunday: ["morning"],
  monday: ["afternoon"],
  tuesday: [],
  wednesday: ["morning", "afternoon"],
  thursday: [],
  friday: ["afternoon", "evening"],
  saturday: ["morning", "afternoon", "evening"]
};

// get array of unavailable dates
let unavailableSlots = generateUnavailableSlots({availability: availabilityTest2});
// let unavailableDates = generateUnavailableSlots({availability: trainerID.availability});

let badDates = [];
  for (let i = 0; i < unavailableSlots.length - 2; i++) {
  // console.log(unavailableDates[i].date);
  if (unavailableSlots[i].date === unavailableSlots[i + 2].date) {
    badDates[i] = unavailableSlots[i].date;
  }
}
let filteredBadDates = badDates.filter(function (el) {
  return el != null;
});

// console.log(badDates);
// console.log(filteredBadDates);


$(function() {
  $("#datepicker").datepicker({
    showAnim: "fold",
    showButtonPanel: true,
    showMonthAfterYear: true,
    showOn: "both",
    showOtherMonths: true,
    minDate: 0,
    maxDate: "+1m",
    beforeShowDay: function(date) {
      const year = date.getFullYear();
      const month = ("" + (date.getMonth() + 1)).slice(-2);
      const day = ("" + (date.getDate())).slice(-2);
      const formatted = month + '/' + day + '/' + year;

      if ($.inArray(formatted, filteredBadDates) === -1) {
        return [true, "","Available"]; 
      } else{
        return [false,"","unAvailable"]; 
      }
    },
    onSelect: function (selectedDate) {
      const dropdown = document.getElementById("dropdown");
      while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
      }

      const timeSlots = document.createElement('option');
      timeSlots.setAttribute("selected", "selected");
      timeSlots.setAttribute("id","time-slot");
      timeSlots.text = "Time Slot";

      const morning = document.createElement('option');
      morning.setAttribute("value", "1");
      morning.text = "morning";

      const afternoon = document.createElement('option');
      afternoon.setAttribute("value", "2");
      afternoon.text = "afternoon";

      const evening = document.createElement('option');
      evening.setAttribute("value", "3");
      evening.text = "evening";

      $("#dropdown").append(timeSlots, morning, afternoon, evening);

      for (let i = 0; i < unavailableSlots.length; i++) {
        const theDate = new Date(unavailableSlots[i].date);
        const year = theDate.getFullYear();
        const month = ("0" + (theDate.getMonth() + 1)).slice(-2);
        const day = ("0" + (theDate.getDate())).slice(-2);
        const formatted = month + '/' + day + '/' + year;
        // console.log(formatted);
        if (formatted == selectedDate){
          if (unavailableSlots[i].time == "morning"){
            morning.parentNode.removeChild(morning);
          }
          if (unavailableSlots[i].time == "afternoon"){
            afternoon.parentNode.removeChild(afternoon);
          }
          if (unavailableSlots[i].time == "evening"){
            evening.parentNode.removeChild(evening);
          }
        }
      }
    }
  });
});


// initial message from client
const comments = document.getElementById("comments");
const dropdown = document.getElementById("dropdown");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn");

confirmBtn.addEventListener("click", function(event) {
  event.preventDefault();
  writeAppointmentSchedule(comments, dropdown, date, trainerID);
});
