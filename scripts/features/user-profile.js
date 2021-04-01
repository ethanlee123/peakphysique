import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections } from "/scripts/api/firebase-queries.js";

// localStorage to grab trainerId
let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
const trainerID = trainerToDisplay.userId
// localStorage.setItem("trainerProfileToDisplay", "")

// ### Constants ###
const db = firebase.firestore();
const fullName = document.getElementbyId("fullName");
const



displayProfileInfo(fullName, phoneNum, bio, workout, cheatMeal, randFact, websiteUrl, radiusTravel, radiusDisplay) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from trainerOnly collection
        trainerOnlyRef.doc(user.uid).get()
        .then(trainerDoc => {
            websiteUrl.value = trainerDoc.data().website;
        }).catch(err => {
            // If doc is undefined, user is not a trainer
            console.log("error: ", err);
        });

        // Get doc from user collection
        userRef.doc(user.uid).get()
        .then(doc => {
            fullName.innerText = doc.data().name;
            phoneNum.value = doc.data().phoneNumber;
            // city.value = doc.data().city;
            bio.value = doc.data().about;
            workout.value = doc.data().favWorkout;
            cheatMeal.value = doc.data().favCheatMeal;
            randFact.value = doc.data().randomFact;
            radiusDisplay.innerText= doc.data().radius;
            userCity.value = doc.date().city;
        });
    });
}
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