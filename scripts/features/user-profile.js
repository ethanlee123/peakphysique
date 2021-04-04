import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections } from "/scripts/api/firebase-queries.js";

// localStorage to grab trainerId
let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
const trainerID = trainerToDisplay.userId
// localStorage.setItem("trainerProfileToDisplay", "")

// ### Constants ###
const db = firebase.firestore();
const fullName = document.getElementById("fullName");
const location = document.getElementById("location");
const profilePic = document.getElementsByClassName("profile-pic");
const favWorkout = document.getElementById("fav-workout-answer");
const favCheatMeal = document.getElementById("fav-cheatMeal-answer");
const fitnessGoals = document.getElementById("fav-fitnessGoals-answer");
const fitnessLevel = document.getElementById("fav-fitnessLevel-answer");
const website = document.getElementById("fav-website-answer");
const hourly = document.getElementById("hourlyRate");
// const availability;
const fitnessServices = document.getElementById("services");
const wellness = document.getElementById("expertise");
const certifications = document.getElementById("certifications");




function displayProfileInfo(fullName, location, profilePic, favWorkout, favCheatMeal, fitnessGoals, fitnessLevel, website, hourly, availability, fitnessServices, wellness, certifications) {
    // firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from trainerOnly collection
        db.collection("trainerOnly").doc("alice-burke-4-35").get()
        .then(trainerDoc => {
            website.innerText = trainerDoc.data().website;
            hourly.innerText = trainerDoc.data().hourlyRate;
            certifications.innerText = trainerDoc.data().certifications;
            fitnessServices.innerText = trainerDoc.data().fitness;
            wellness.innerText = trainerDoc.data().wellness;
            const imageUrl = trainerDoc.data().profilePic;
            profilePic[0].setAttribute("src", imageUrl);
            // availability.innerText = trainerDoc.data().availability
        }).catch(err => {
            // If doc is undefined, user is not a trainer
            console.log("error: ", err);
        });

        // Get doc from user collection
        db.collection("user").doc("1u05U9gAO4YW4E5PivlANqQ69QU2").get()
        .then(doc => {
            fullName.innerText = doc.data().name;
            location.innerText = doc.data().city;
            favWorkout.innerText = doc.data().favWorkout;
            favCheatMeal.innerText = doc.data().favCheatMeal;           
            // fitnessGoals.innerText = doc.data().fitnessGoals;
            // fitnessLevel.innerText = doc.data().fitnessLevel;
            // city.value = doc.data().city;
            // bio.value = doc.data().about;
            // randFact.value = doc.data().randomFact;
            // radiusDisplay.innerText= doc.data().radius;
            // userCity.value = doc.date().city;
        });
    }
// }
displayProfileInfo(fullName, location, profilePic, favWorkout, favCheatMeal, fitnessGoals, fitnessLevel, website, hourly, availability, fitnessServices, wellness, certifications);
// displayTrainerInfo();
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


// displayAboutMe();


// Local storage to carry trainer ID onto book appt page
// need to update to make sure local storage is cleared?
const bookAppt = document.querySelector(".book-button");
bookAppt.addEventListener("click", (e) => {
    localStorage.setItem("trainerID", JSON.stringify(trainerToDisplay));
    console.log(trainerToDisplay);
});