import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections, trainerProfilePosts } from "/scripts/api/firebase-queries.js";

let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = JSON.parse(trainerToDisplay);
localStorage.setItem("trainerProfileToDisplay", "");
console.log(trainerToDisplay);
// displayTrainerInfo();
// hideUserSections();
// trainerProfilePosts();
// displayAboutMe();