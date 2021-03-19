import { personalizedWelcome, createUser, setUserRole } from "/scripts/api/firebase-queries.js";

// the entire query will be put into firebase-queries (when we live share) and 
// this script will import the necessary functions (queries)
const nameId = document.querySelector("#name");
const clientBtn = document.getElementById("client");
const trainerBtn = document.getElementById("trainer");
// console.log(clientBtn);

personalizedWelcome(nameId);

createUser();

// When user clicks button set "role" field respectively
// Once selected cannot be changed even with the back button/refreshing
clientBtn.onclick = function() {
    setUserRole("client");
};
trainerBtn.onclick = function() {
    setUserRole("trainer");
};


// disable btn after clicked on by adding disabled attr

