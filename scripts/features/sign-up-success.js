import { personalizedWelcome, createUser, updateUserRole } from "/scripts/api/firebase-queries.js";

// the entire query will be put into firebase-queries (when we live share) and 
// this script will import the necessary functions (queries)
const nameId = document.querySelector("#name");
const clientBtn = document.getElementById("client");
const trainerBtn = document.getElementById("trainer");

personalizedWelcome(nameId);
createUser();

clientBtn.addEventListener("click", function(event) {
    // Stops anchor tag from its default action, loading next page
    event.preventDefault();
    updateUserRole("client");
    // Delays redirecting to next page, so updateUserRole() can finish executing
    setTimeout(function() {
        window.location.href = "sign-up-profile-setup.html";
    }, 500);
}, false);

trainerBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateUserRole("trainer");
    setTimeout(function() {
        window.location.href = "sign-up-profile-setup.html";
    }, 500);
    
}, false);

// disable the button after it is clicked and has loaded next page...

