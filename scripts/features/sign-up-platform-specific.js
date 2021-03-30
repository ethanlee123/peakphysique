import { displayPlatformSpecifics, updatePlatformSpecifics } from "/scripts/api/firebase-queries.js";

const rate = document.getElementById("rate");
const deposit = document.getElementById("deposit");
const freeSession = document.getElementById("freeSession");
const preBookingMsg = document.getElementById("preBookingMsg");

const saveReturn = document.getElementById("next-btn");

displayPlatformSpecifics(rate, deposit, freeSession, preBookingMsg);

saveReturn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("clicked save and return");
    updatePlatformSpecifics(rate, deposit, freeSession, preBookingMsg);
})
