import { displayProfileInfo, updateProfileInfo, uploadProfileImg, displayUserProfileImg } from "/scripts/api/firebase-queries.js";
import { getLocation } from "/scripts/api/here-api.js"

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

// Reference to image tag
const userProfileImg = document.getElementById("userProfileImg");
// Reference to input tag to upload profile image
const imageInput = document.getElementById("profileImgInp");
//Reference to font awesome edit profile icons
const profileIcon = document.getElementById("profileImagePlaceHolder");

const saveReturnBtn = document.getElementById("next-btn");

var trainerListLoader = {
    set isLoading(loading) {
        if (loading) {
            loader.style.display = "block";
            resultsMeta.style.display = "none";
            trainerList.style.display = "none";
        } else {
            loader.style.display = "none";
            resultsMeta.style.display = "flex";
            trainerList.style.display = "grid";
        }
    }
};


// Asks user to allow/block locations
console.log("location: " + getLocation());

// Displays user profile information on edit profile
displayProfileInfo(fullName, phoneNum, bio, favWorkout, favCheatMeal, randFact, websiteUrl, radius, radiusDisplay, userCity);

displayUserProfileImg(userProfileImg);

// Updates firebase
saveReturnBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateProfileInfo(websiteUrl, phoneNum, bio, favWorkout, favCheatMeal, randFact, radius);
})
    
imageInput.addEventListener("change", function(e) {
    let file = e.target.files[0];
    let blob = URL.createObjectURL(file);
    userProfileImg.setAttribute("src", blob);
    uploadProfileImg(file);
})
