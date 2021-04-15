import { getAvailabilityText } from "/scripts/util/getTrainerText.js";

// localStorage to grab trainerId
let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
const trainerID = trainerToDisplay.userId

// ### Constants ###
const db = firebase.firestore();
const fullName = document.getElementById("fullName");
const location = document.getElementById("location");
const favWorkout = document.getElementById("fav-workout-answer");
const favCheatMeal = document.getElementById("fav-cheatMeal-answer");
const fitnessGoals = document.getElementById("fav-fitnessGoals-answer");
const fitnessLevel = document.getElementById("fav-fitnessLevel-answer");
const website = document.getElementById("fav-website-answer");
const hourly = document.getElementById("hourlyRate");
const availability = document.getElementById("availability");
const fitnessServices = document.getElementById("services");
const wellness = document.getElementById("expertise");
const certifications = document.getElementById("certifications");
const profileImg = document.querySelector(".trainer-profile-pic");

const loader = document.getElementById("loader");
const profilePage = document.querySelector(".main-content");

// used to capitalize reads from Firestore
const capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, text => {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
}

// generates user profile pic, if no profile pic is found, sets to initials.
const getUserAvatar = ({
    user,
    parentNode,
    profilePicSelector = ".trainer-profile-pic img",
    userInitialsSelector = ".initials",
    firstName,
    lastName,
    profilePicPath,
}) => {
    const profilePic = parentNode.querySelector(profilePicSelector);
    const userInitials = parentNode.querySelector(userInitialsSelector);
    if (profilePicPath) {
        userInitials.remove();
        profilePic.setAttribute("src", profilePicPath);
        profilePic.setAttribute("alt", `${user?.name} avatar`);
    } else {
        profilePic.remove();
        const initials = `${firstName.substring(0, 1)} ${lastName.substring(0, 1)}`;
        userInitials.appendChild(document.createTextNode(initials));
    }
}


function displayProfileInfo(fullName, profileImg, location, availability, favWorkout, favCheatMeal, fitnessGoals, fitnessLevel, website, hourly, fitnessServices, wellness, certifications) {
        // Get doc from trainerOnly collection
        db.collection("trainerOnly").doc(trainerID).get()
        .then(async trainerDoc => {
            website.innerText = trainerDoc.data().website;
            hourly.innerText = trainerDoc.data().hourlyRate;
            availability.innerHTML = getAvailabilityText(trainerDoc.data().availability);
            var certificationsArray = trainerDoc.data().certifications;
            for (let i in certificationsArray) {
                certificationsArray[i] = " " + capitalizeWords(certificationsArray[i]);
            }
            certifications.innerText = certificationsArray;

            var fitnessArray = trainerDoc.data().fitness;
            for (let i in fitnessArray) {
                fitnessArray[i] = " " + capitalizeWords(fitnessArray[i]);
            }
            fitnessServices.innerText = fitnessArray;

            var wellnessArray = trainerDoc.data().wellness;
            for (let i in wellnessArray) {
                wellnessArray[i] = " " + capitalizeWords(wellnessArray[i]);
            }
            wellness.innerText = wellnessArray;

            let lastN = trainerDoc.data().lastName;
            let firstN = trainerDoc.data().firstName;
            let profileP = trainerDoc.data().profilePic;

            await getUserAvatar({user: trainerID, parentNode: profileImg, profilePicSelector: ".trainer-profile-pic img", firstName: firstN,
            lastName: lastN, profilePicPath: profileP});
        })
        .catch(err => {
            // If doc is undefined, user is not a trainer
            console.log("error: ", err);
        });

        // Get doc from user collection
        db.collection("user").doc(trainerID).get()
        .then(doc => {
            fullName.innerText = doc.data().name;
            location.innerText = doc.data().city;
            favWorkout.innerText = doc.data().favWorkout;
            favCheatMeal.innerText = doc.data().favCheatMeal;  
            fitnessGoals.innerText = capitalizeWords(doc.data().fitnessGoals); 
            fitnessLevel.innerText = capitalizeWords(doc.data().fitnessLevel); 

        });
    }
// function is called under initialRender()

// hideUserSections();

// gets user post and posts to "Updates" section
function trainerProfilePosts() {
    console.log(trainerID);

    db.collection("trainerOnly").doc(trainerID).get()         // pulls from specific userID doc
    .then(function(doc){
        if (doc.data().posts !== undefined) {                   // gets post only if exists
            let postDate = doc.data().posts.Date.toDate().toDateString();
            let postMsg = doc.data().posts.message;
            let postTitle= doc.data().posts.title;
            
            document.getElementById('postDate').innerText = postDate;
            document.getElementById('postMessage').innerText = postMsg;
            document.getElementById('postTitle').innerText = postTitle;
            } 
            else {                                              // default if no posts
                document.getElementById('postTitle').innerText = "No posts yet, stay tuned!";
                document.getElementById('postDate').innerText = "";
                document.getElementById('postMessage').innerText = "";
            }
 
        })
    }
trainerProfilePosts();


var profileLoader = {
    set isLoading(loading) {
        if (loading) {
            loader.style.display = "block";
            profilePage.style.display = "none";
        } else {
            loader.style.display = "none";
            profilePage.style.display = "block";
        }
    }
};

// waits for firestore response before loading page
const initialRender = () => {
    profileLoader.isLoading = true;    
    
    displayProfileInfo(fullName, profileImg, location, availability, favWorkout, favCheatMeal, fitnessGoals, fitnessLevel, website, hourly, fitnessServices, wellness, certifications);
    
    setTimeout(function() {
        profileLoader.isLoading = false;
    }, 1000)
}
initialRender();

// displayAboutMe();


// Local storage to carry trainer ID onto book appt page
// need to update to make sure local storage is cleared?
const bookAppt = document.querySelector(".book-button");
bookAppt.addEventListener("click", (e) => {
    localStorage.setItem("trainerID", JSON.stringify(trainerToDisplay));
    console.log(trainerToDisplay);
});