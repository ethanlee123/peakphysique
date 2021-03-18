// import { displayName } from "/scripts/api/firebase_api_team37.js";
var firebaseConfig = {
    apiKey: "AIzaSyAjZGN7j00ud_vfpIlt-enOlSAqpjNhWBI",
    authDomain: "peak-physique-a0c48.firebaseapp.com",
    projectId: "peak-physique-a0c48",
    storageBucket: "peak-physique-a0c48.appspot.com",
    messagingSenderId: "278845824422",
    appId: "1:278845824422:web:31464ec47ef880324e4367"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const nameId = document.querySelector("#name");
var displayName, email, photoUrl, uid, emailVerified;

// firebase doc: manage users
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        displayName = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                        // this value to authenticate with your backend server, if
                        // you have one. Use User.getToken() instead.
        
        // Set personalize welcome message
        nameId.innerText = displayName;
    } else {
    // No user is signed in.
    console.log("user is not signed in");
    }
});


//put below code into firebase-queries during live share
const db = firebase.firestore();
function writeUserRole(role) {
    
}

// When user clicks button set "role" field respectively
document.getElementById("client").addEventListener("click", writeUserRole(client));
document.getElementById("trainer").addEventListener("click", writeUserRole(trainer));

