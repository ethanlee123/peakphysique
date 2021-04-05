import { personalizedWelcome, createUser, updateUserRole, isFirstTime } from "/scripts/api/firebase-queries.js";

// the entire query will be put into firebase-queries (when we live share) and 
// this script will import the necessary functions (queries)
const nameId = document.querySelector("#name");
const clientBtn = document.getElementById("client");
const trainerBtn = document.getElementById("trainer");

const loader = document.getElementById("loader");
const question = document.getElementById("question");

async function displayName() {
    let response = await createUser();
    personalizedWelcome(nameId);
}
displayName();

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

// Loader
var contentLoader = {
    set isLoading(loading) {
        if (loading) {
            loader.style.display = "block";
            question.style.display = "none";
            clientBtn.style.display = "none";
            trainerBtn.style.display = "none";
        } else {
            loader.style.display = "none";
            question.style.display = "block";
            clientBtn.style.display = "flex";
            trainerBtn.style.display = "flex";
        }
    }
};

const initialRender = () => {
    contentLoader.isLoading = true;    
    
    isFirstTime();
    
    setTimeout(function() {
        contentLoader.isLoading = false;
    }, 1000)
}

initialRender();

