import { displayProfileInfo, updateProfileInfo, getLocation } from "/scripts/api/firebase-queries.js";

const fullName = document.getElementById("name");
// Reference to Phone Number input field, use .value to modify/set
const phoneNum = document.getElementById("phone");
const userCity = document.getElementById("city");
// Reference to "tell us a bit about yourself" textarea
const bio = document.getElementById("bio");
const favWorkout = document.getElementById("workout");
const favCheatMeal = document.getElementById("meal");
const randFact = document.getElementById("fact");
const websiteUrl = document.getElementById("website");
// Reference to radius of travel value from input
const radius = document.getElementById("customRange");
// Reference radius displayed on UI
const radiusDisplay = document.getElementById("radius");

const saveReturnBtn = document.getElementById("next-btn");

// Asks user to allow/block locations
getLocation();



displayProfileInfo(fullName, phoneNum, bio, favWorkout, favCheatMeal, randFact, websiteUrl, radius, radiusDisplay);

saveReturnBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateProfileInfo(websiteUrl, phoneNum, bio, favWorkout, favCheatMeal, randFact, radius);

})
    

