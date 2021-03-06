import { displayProfileInfo, updateProfileInfo, uploadProfileImg, displayUserProfileImg, displayWebsiteField } from "/scripts/api/firebase-queries.js";
import { getLocation } from "/scripts/api/here-api.js";

// Reference to Phone Number input field, use .value to modify/set
const phoneNum = document.getElementById("phone");
// Reference to "tell us a bit about yourself" textarea
const bio = document.getElementById("bio");
// Reference to radius of travel value from input
const radius = document.getElementById("customRange");
// Reference radius displayed on UI
const radiusDisplay = document.getElementById("radius");

const fullName = document.getElementById("name");
const favWorkout = document.getElementById("workout");
const favCheatMeal = document.getElementById("meal");
const randFact = document.getElementById("fact");
const websiteUrl = document.getElementById("website");
const userCity = document.getElementById("city");
const websiteListItem = document.getElementById("websiteListItem");

// Reference to image tag
const userProfileImg = document.querySelector(".avatar-img");
// Reference to input tag to upload profile image
const imageInput = document.getElementById("profileImgInp");

const saveReturnBtn = document.getElementById("next-btn");

const loader = document.getElementById("loader");
const name = document.getElementById("name");
const labelImg = document.querySelector(".user-avatar");

// Asks user to allow/block locations
getLocation();

// Updates firebase
saveReturnBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateProfileInfo(websiteUrl, phoneNum, bio, favWorkout, favCheatMeal, randFact, radius);
})
    
imageInput.addEventListener("change", function(e) {
    let file = e.target.files[0];
    let blob = URL.createObjectURL(file);
    uploadProfileImg(file, labelImg);
    userProfileImg.setAttribute("src", blob);
})

// Loader
var trainerListLoader = {
    set isLoading(loading) {
        if (loading) {
            loader.style.display = "block";
            name.style.display = "none";
            websiteListItem.style.display = "none";
        } else {
            loader.style.display = "none";
            name.style.display = "block";
        }
    }
};

const initialRender = () => {
    trainerListLoader.isLoading = true;    
    
    displayWebsiteField(websiteListItem);
    displayProfileInfo(fullName, phoneNum, bio, favWorkout, favCheatMeal, randFact, websiteUrl, radius, radiusDisplay, userCity);
    displayUserProfileImg(labelImg);

    setTimeout(function() {
        trainerListLoader.isLoading = false;
    }, 1000)
}

initialRender();
