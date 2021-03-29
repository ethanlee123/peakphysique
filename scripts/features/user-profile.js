import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections, trainerProfilePosts } from "/scripts/api/firebase-queries.js";

let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
console.log(trainerToDisplay);
localStorage.setItem("trainerProfileToDisplay", "");
// displayTrainerInfo();
// hideUserSections();
// trainerProfilePosts();
// displayAboutMe();