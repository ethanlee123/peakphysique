import { displayAboutMe } from "../api/firebase-queries.js";
import { displayTrainerInfo, hideUserSections } from "/scripts/api/firebase-queries.js";

let trainerToDisplay = localStorage.getItem("trainerProfileToDisplay");
trainerToDisplay = trainerToDisplay ? JSON.parse(trainerToDisplay) : window.location.href="./404.html";
const trainerID = trainerToDisplay.userId
localStorage.setItem("trainerProfileToDisplay", "")

const db = firebase.firestore();



// displayTrainerInfo();
// hideUserSections();
function trainerProfilePosts() {
    console.log(trainerID);

    db.collection("trainerOnly").doc(trainerID).get()         // pulls from "Chuck Norris" doc
    .then(function(doc){
            let postDate = doc.data().posts.Date.toDate().toDateString();
            console.log(postDate);
            let postMsg = doc.data().posts.message;
            console.log(postMsg);
            let postTitle= doc.data().posts.title;
            console.log(postTitle);

            document.getElementById('postDate').innerText = postDate;
            document.getElementById('postMessage').innerText = postMsg;
            document.getElementById('postTitle').innerText = postTitle;
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