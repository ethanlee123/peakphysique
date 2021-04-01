import { generateUnavailableSlots } from "../util/generateUnavailableSlots.js";

let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);
console.log(trainerID);

$(function() {
    $( "#datepicker" ).datepicker({
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
    }
  });
});

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
let unavailableDates = generateUnavailableSlots({availability: availabilityTest2});
// let unavailableDates = generateUnavailableSlots({availability: trainerID.availability});

let badDates = [];

for (let i = 0; i < unavailableDates.length - 2; i++) {
  console.log(unavailableDates[i].date);
  if (unavailableDates[i].date === unavailableDates[i + 2].date) {
    badDates[i] = unavailableDates[i].date;
  }
}

let filteredBadDates = badDates.filter(function (el) {
  return el != null;
});

// console.log(badDates);
// console.log(filteredBadDates);
