import { updateExpertise, displayExpertise } from '../../scripts/api/firebase-queries.js';

const certTitle =  document.getElementById("certTitle");
const certFile = document.getElementById("upload");

const years = document.getElementById("years");

// Get NodeList of input tag under fitness specialization
const fitnessInp = document.querySelectorAll(".fit-btn");

const fitnessLabels = document.querySelectorAll(".fit-labels");

// Get NodeList of input tag under wellness specialization
const wellnessInp = document.querySelectorAll(".well-btn");

// Get reference to a tag not button
const saveReturn = document.getElementById("next-btn");

// Trainer selected fitness specializations
var fitnessList = [];

//Trainer selected wellness specializations
var wellnessList = [];

let twolists = displayExpertise(certTitle, years);

console.log(twolists);



fitnessInp.forEach((input) => {
    // returns nodelist with one label
    let label = input.labels;
    label[0].addEventListener("click", function(e) {
        let nameOfSpec = label[0].innerText.toLowerCase();
        if (input.checked == false) {
            fitnessList.push(nameOfSpec);
        } else {
            // Get index of specific value based on name
            let index = fitnessList.indexOf(label[0])
            // Removes value from list
            fitnessList.splice(index);
        }
    })
})


wellnessInp.forEach((input) => {
    // returns nodelist with one label
    let label = input.labels;
    label[0].addEventListener("click", function(e) {
        let nameOfSpec = label[0].innerText.toLowerCase();
        if (input.checked == false) {
            fitnessList.push(nameOfSpec);
        } else {
            // Get index of specific value based on name
            let index = wellnessList.indexOf(label[0]);
            // Removes value from list
            wellnessList.splice(index);
        }
    })
})

// Clicking save and return will update database
saveReturn.addEventListener("click", function(e) {
    e.preventDefault();
    updateExpertise(certTitle, years, fitnessList, wellnessList);
})
