import { personalizedWelcome } from "/scripts/api/firebase-queries.js";
const firstName = document.getElementById("name");

personalizedWelcome(firstName);

