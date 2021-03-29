import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections, trainerProfilePosts } from "/scripts/api/firebase-queries.js";

let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
console.log(trainerToDisplay);
localStorage.setItem("trainerProfileToDisplay", "")



// displayTrainerInfo();
// hideUserSections();
// trainerProfilePosts();
// displayAboutMe();


// Local storage to carry trainer ID onto book appt page
// need to update to make sure local storage is cleared?
const bookAppt = document.querySelector(".book-button");
bookAppt.addEventListener("click", (e) => {
    localStorage.setItem("trainerID", JSON.stringify(trainerToDisplay));
    console.log(trainerToDisplay);
});