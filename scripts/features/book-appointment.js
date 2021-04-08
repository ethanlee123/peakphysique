import { displayBookInfo, writeAppointmentSchedule } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";
import { debounce } from "/scripts/util/debounce.js";

// get trainerID from Book Appointment button on profile page
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);

// console.log(trainerID);



// get array of unavailable dates
let unavailableSlots = generateUnavailableSlots({availability: trainerID.availability});

// console.log(unavailableSlots);

let badDates = [];

for (let i = 0; i < unavailableSlots.length - 2; i++) {
  if (unavailableSlots[i].date === unavailableSlots[i + 2].date) {
    badDates[i] = unavailableSlots[i].date;
  }
}

// console.log(badDates);

let filteredBadDates = badDates.filter(function (element) {
  return element != null;
});

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

      const morning = document.createElement('option');
      morning.setAttribute("value", "1");
      morning.text = "morning";

      const afternoon = document.createElement('option');
      afternoon.setAttribute("value", "2");
      afternoon.text = "afternoon";

      const evening = document.createElement('option');
      evening.setAttribute("value", "3");
      evening.text = "evening";

      $("#dropdown").append(morning, afternoon, evening);

      for (let i = 0; i < unavailableSlots.length; i++) {
        const theDate = new Date(unavailableSlots[i].date);
        const year = theDate.getFullYear();
        const month = ("0" + (theDate.getMonth() + 1)).slice(-2);
        const day = ("0" + (theDate.getDate())).slice(-2);
        const formatted = month + '/' + day + '/' + year;
        
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

        dropdown.firstChild.setAttribute("selected", "");
        
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
  confirmBtn.disabled = true;
  event.preventDefault();
  writeAppointmentSchedule(comments, dropdown, date, trainerID);
});

const main = document.getElementById("main");
const loader = document.getElementById("loader");

var bookLoader = {
  set isLoading(loading) {
      if (loading) {
          loader.style.display = "block";
          main.style.display = "none";
      } else {
          loader.style.display = "none";
          main.style.display = "block";
      }
  }
};

const initialRender = async () => {
  bookLoader.isLoading = true;

  displayBookInfo(trainerID);

  setTimeout(function() {
    bookLoader.isLoading = false;
  }, 1000)
}

initialRender();
