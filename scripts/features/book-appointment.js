import { displayBookInfo, writeAppointmentSchedule, getScheduleInfo } from "/scripts/api/firebase-queries.js";
import { generateUnavailableSlots } from "/scripts/util/generateUnavailableSlots.js";

// Get trainerID from local storage
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);

// Get array of unavailable time slots from trainer availability
let unavailableSlots = generateUnavailableSlots({
    availability: trainerID.availability
});

// Get array of booked time slots
let bookedSlots = getScheduleInfo(trainerID);

let badDates = [];

setTimeout(function () {
    // Add booked slots to unavailable slots array
    for (let i = 0; i < bookedSlots.length; i++) {
        unavailableSlots.push(bookedSlots[i]);
    }

    // Sort array by date
    unavailableSlots.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Populate badDates array with unavailable slots
    for (let i = 0; i < unavailableSlots.length - 2; i++) {
        if (unavailableSlots[i].date === unavailableSlots[i + 2].date) {
            badDates[i] = unavailableSlots[i].date;
        }
    }

    // Filter badDates array to remove empty indexes
    let filteredBadDates = badDates.filter(function (element) {
        return element != null;
    });

    // Initialize datepicker widget from jquery
    $(function () {
        $("#datepicker").datepicker({
            showAnim: "fold",
            showButtonPanel: true,
            showMonthAfterYear: true,
            showOn: "both",
            showOtherMonths: true,
            minDate: 0, // Set to only display dates from today's date onwards
            maxDate: "+1m", // Set to only display up to one month from today's date
            // Block out unavailable dates on the datepicker
            beforeShowDay: function (date) {
                // Format date to appropriate format
                const year = date.getFullYear();
                const month = ("" + (date.getMonth() + 1)).slice(-2);
                const day = ("" + (date.getDate())).slice(-2);
                const formatted = month + '/' + day + '/' + year;

                // Checks for unavailable dates in filteredBadDates array
                if ($.inArray(formatted, filteredBadDates) === -1) {
                    return [true, "", "Available"];
                } else {
                    return [false, "", "unAvailable"];
                }
            },
            // Dynamically generate the time-slots dropdown selection based on the unavailable time slots
            onSelect: function (selectedDate) {
                const dropdown = document.getElementById("dropdown");
                // Clear the previous dropdown selections each time a new date is selected
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

                // Check for unavailable time-slots on the selected date
                for (let i = 0; i < unavailableSlots.length; i++) {
                    // Format date to appropriate format
                    const theDate = new Date(unavailableSlots[i].date);
                    const year = theDate.getFullYear();
                    const month = ("0" + (theDate.getMonth() + 1)).slice(-2);
                    const day = ("0" + (theDate.getDate())).slice(-2);
                    const formatted = month + '/' + day + '/' + year;

                    if (formatted == selectedDate) {
                        if (unavailableSlots[i].time == "morning") {
                            morning.parentNode.removeChild(morning);
                        }
                        if (unavailableSlots[i].time == "afternoon") {
                            afternoon.parentNode.removeChild(afternoon);
                        }
                        if (unavailableSlots[i].time == "evening") {
                            evening.parentNode.removeChild(evening);
                        }
                    }

                    dropdown.firstChild.setAttribute("selected", "");
                }
            }
        });
    });
}, 2000);

const comments = document.getElementById("comments");
const dropdown = document.getElementById("dropdown");
const date = document.getElementById("datepicker");
const confirmBtn = document.getElementById("confirm-btn");

confirmBtn.addEventListener("click", function (event) {
    confirmBtn.disabled = true;
    event.preventDefault();
    writeAppointmentSchedule(comments, dropdown, new Date(date.value), trainerID);
});

const main = document.getElementById("main");
const loader = document.getElementById("loader");

// Sets html body display to none if data is loading
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

// Activates loader while data is loading
const initialRender = async () => {
    bookLoader.isLoading = true;

    displayBookInfo(trainerID);

    setTimeout(function () {
        bookLoader.isLoading = false;
    }, 2000)
}

initialRender();