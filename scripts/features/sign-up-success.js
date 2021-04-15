import { personalizedWelcome, updateUserRole, isFirstTime } from "/scripts/api/firebase-queries.js";

const nameId = document.querySelector("#name");
const clientBtn = document.getElementById("client");
const trainerBtn = document.getElementById("trainer");

const loader = document.getElementById("loader");
const question = document.getElementById("question");

async function displayName() {
    personalizedWelcome(nameId);
}
displayName();

clientBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateUserRole("client");
}, false);

trainerBtn.addEventListener("click", function(event) {
    event.preventDefault();
    updateUserRole("trainer");   
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

