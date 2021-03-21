// Sprint 2: reading/writing to firebase
import { firebaseConfig } from "/scripts/api/firebase_api_team37.js";
// firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Reference to user collection, no document specified
const userRef = db.collection("user");
// Reference to trainerOnly collection, , no document specified
const trainerOnlyRef = db.collection("trainerOnly");


export function displayTrainerInfo(){
  console.log("hello from displayTrainerInfo! :)");
  db.collection("trainer").get() 
  .then(function(c){
      c.forEach(function(doc){
          let trainerFirstName = doc.data().name.first;             //gets the first name field
          console.log(trainerFirstName);
          let trainerLastName = doc.data().name.last;             //gets the last name field
          console.log(trainerLastName);
          let totalClients = doc.data().totalClients;        //gets the totalClients ID field
          console.log(totalClients);
          let totalSessions = doc.data().totalSessions;        //gets the totalSessions ID field
          console.log(totalSessions);
          let hourlyRate = doc.data().platformSpecific.hourlyRate;  // WILL CHANGE TO MATCH NESTED COLLECTIONS AS 
          console.log(hourlyRate);                                  // DONE IN userProfile SCHEMA.JS
          let services = doc.data().platformSpecific.services;      // change to wellness options?
          console.log(services);
          let expertise = doc.data().platformSpecific.expertise;    // change to fitness options?
          console.log(expertise);
          let certifications = doc.data().platformSpecific.certifications;
          console.log(certifications);
          let location = doc.data().location;
          console.log(location);
          let availability = doc.data().availability;
          console.log(availability);
          

          document.getElementById('trainerFirstName').innerText = trainerFirstName;
          document.getElementById('trainerLastName').innerText = trainerLastName;
          document.getElementById('totalClients').innerText = totalClients;
          document.getElementById('totalSessions').innerText = totalSessions;
          document.getElementById('hourlyRate').innerText = hourlyRate;
          document.getElementById('services').innerText = services;
          document.getElementById('expertise').innerText = expertise;
          document.getElementById('certifications').innerText = certifications;
          document.getElementById('location').innerText = location;
          document.getElementById('availability').innerText = availability;

      })

  })
}
// displayTrainerInfo();

const getCollection = async (collectionName) => {
    return await db.collection(collectionName).get()
      .then((response) => {
        return response.docs.map(doc => doc.data());
      });
}

function writeUserProfile() {
    var trainerRef = db.collection("trainer");

    trainerRef.add({
        firstName: "firstName1",
        lastName: "lastName1",
        location: new firebase.firestore.GeoPoint(37.422, 122.084), // GeoPoint(double latitude, double longitude)
        gender: "Male",
        age: "28",
        profilePic: "./profile-pic.jpg",
        website: "trainermike.com",
        services: [
            "test1",
            "test2",
            "test3"
        ],
        expertise: [
            "bodybuilding",
            "endurance training",
            "weight loss"
        ],
        hourlyRate: 40,
        firstSessionFree: true,
        appointments: 
        [
            {
                date: new firebase.firestore.Timestamp.now(),
                time: "Morning",
                available: true
            },
            {
                date: "9999-12-31T23:59:59Z",
                time: "Afternoon",
                available: false
            }
        ],
        yearsOfExperience: 3,
        totalClients: 5,
        totalSessions: 10,
        posts: [
            {
                date: "9999-12-31T23:59:59Z",
                message: "Hello world!"
            }
        ],
        certifications: [
            "blah",
            "yadda",
            "toodles"
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike"
        }
    });

}
// writeUserProfile();   

function writeAppointmentSchedule() {
    var scheduleRef = db.collection("schedule");

    scheduleRef.add({
      // Get this from jquery date picker
    date: new firebase.firestore.Timestamp.fromDate(new Date("March 20 2021")), // Timestamp
    time: "", // String morning, afternoon, or evening
    // location: "",
    completed: false, // boolean default false
    clientProfilePic: "https://i.dailymail.co.uk/1s/2021/03/03/23/40017992-9323427-image-m-25_1614815098810.jpg",
    clientFirstName: "Soupy",
    clientLasttName: "Kestrel",
    clientUserId: "", //user_id
    trainerProfilePic: "https://vz.cnwimg.com/thumb-1200x/wp-content/uploads/2010/03/Fabio-e1603764807834.jpg",
    trainerFirstName: "Speckled",
    trainerLastName: "Lamb",
    trainerUserId: "", //user_id
    initialMsgFromClient: "", //user input from comments form
    bookingMsg: "" //pull from trainer collection
    });
}

export function personalizedWelcome(selector) {
    // Only authenticated users, can be set in firebase console storage "rules" tab
    firebase.auth().onAuthStateChanged(function(user) {
        const userRefDoc = userRef.doc(user.uid);
        userRefDoc.get()
        .then((doc) => {
            if (user) {        
                // Set personalize welcome message
                selector.innerText = doc.data().firstName;
            } else {
                // No user is signed in.
                selector.innerText = "John Doe";
                console.log("user is not signed in");
            }
        });
    });
}

// Asks user to allow/block locations
export function getLocation() {
    if (navigator.geolocation) {
        // First param is "successCallback", second is "blockedCallback"
        navigator.geolocation.getCurrentPosition(allowedLocation, blockedLocation);
        
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// Support: callback function for getLocation()
function allowedLocation(position) {
    firebase.auth().onAuthStateChanged(function(user) {

    });
    console.log(position.coords.longitude);
    console.log(position.coords.latitude);
}
// Support: callback function for getLocation()
function blockedLocation(error) {
    if(error.code == 1) {
        alert("Allow locations helps us show you people near your area");
    } else if(error.code == 2) {
        alert("The network is down or the positioning service can't be reached.");
    } else if(error.code == 3) {
        alert("The attempt timed out before it could get the location data.");
    } else {
        alert("Geolocation failed due to unknown error.");
    }
}

// creates document id with user uid in both user and trainerOnly collectinos
export function createUser() {
    // Only authenticated users, can be set in firebase console storage "rules" tab
    firebase.auth().onAuthStateChanged(function(user) { 
        // Get ref to user collection with doc id = user UID, will return doc id, if it exists
        userRef.doc(user.uid).get()
        .then((docSnapshot) =>  {
            // if user uid doesn't already exist in user collection 
            if(!docSnapshot.exists) {
                // Returns list with 2 items separated by the first space
                let names = user.displayName.split(" ", 2);
                userRef.doc(user.uid).set({
                    userId: user.uid,
                    email: user.email,
                    firstName: names[0],
                    lastName: names[1],
                    name: user.displayName,
                    fitnessGoals: "",
                    age: null,
                    phoneNumber: "",
                    gender: "",
                    location: new firebase.firestore.GeoPoint(37.422, 122.084),
                    favCheatMeal: "",
                    favWorkout: "",
                    fitnessLevel: "",
                    gender: null, 
                    profilePic: "", 
                    rating: null, 
                    facebook: "",
                    instagram: "",
                    role: null,
                });
                trainerOnlyRef.doc(user.uid).set({
                    userId: user.uid,
                    firstName: names[0],
                    lastName: names[1],
                    name: user.displayName,
                    website: "",
                    hourlyRate: null,
                    deposit: null,
                    firstSessionFree: null,
                    yearsOfExperience: null,
                    rating: null,
                    fitness: [],
                    wellness: [],
                    certifications: [], // strArr
                    availability: {
                        monday: [], // strArr; morning, afternoon or evening
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                        sunday: []
                    }
                });
            };
        });
    });
}

// Set role field in user collection
export function updateUserRole(userRole) {
    firebase.auth().onAuthStateChanged(function(user) {
        const userDocRef = userRef.doc(user.uid);
        if (userRole == "trainer") {
            userDocRef.update({
                role: "trainer"
            })
        } else if (userRole == "client") {
            userDocRef.update({
                role:"client"
            });
        }
    });
}

export function displayScheduleInfo(){
    console.log("Schedule Info! :)");
    db.collection("schedule").get() // gets the entire collection??
    .then(function(s){
        s.forEach(function(doc){
            let trainerFirstName = doc.data().trainerFirstName;            
            console.log(trainerFirstName);
            let trainerLastName = doc.data().trainerLastName;            
            console.log(trainerLastName);
            let time = doc.data().time;            
            console.log(time);
            let date = doc.data().date;            
            console.log(date);
            // let bookingMsg = doc.data().bookingMsg;            
            // console.log(bookingMsg);                             // trainer booking msg or client msg???

            let completed = doc.data().completed;
            console.log(completed);                                 // completed appointment

            document.getElementById('trainerFirstName').innerText = trainerFirstName;
            document.getElementById('trainerLastName').innerText = trainerLastName;
            document.getElementById('appt-time').innerText = time;
            document.getElementById('appt-date').innerText = date;


            // sets "add to Calendar" and "cancel" buttons as hidden if appointment completed
            if (completed == true) {
                let completedBtn = document.getElementsByClassName('hideScheduleBtn');
                for (let i = 0; i < completedBtn.length; i++) {
                    completedBtn[i].style.display = "none";
                }             
            }
            // document.getElementById('bookingMsg').innerText = bookingMsg;
        }) 
    })
}

  // hides sections of profile depending on if user or trainer
export function hideUserSections(){
    let userSection = document.getElementsByClassName('hideUserSection');
    console.log("hiding user sections");
    for (let i = 0; i< userSection.length; i++) {
        userSection[i].style.display = "none";
    }
}

// gets user post and posts to "Updates" section
export function trainerProfilePosts() {
    console.log("Profile Posts :)");
    db.collection("trainer").doc("x4FAASQ2nGzvN4UL7rjB").get()         // pulls from "Chuck Norris" doc
    .then(function(doc){
            let postDate = doc.data().posts[0].date.toDate();
            console.log(postDate);
            let postMsg = doc.data().posts[0].message;
            console.log(postMsg);
            let postTitle= doc.data().posts[0].title;
            console.log(postTitle);

            document.getElementById('postDate').innerText = postDate;
            document.getElementById('postMessage').innerText = postMsg;
            document.getElementById('postTitle').innerText = postTitle;
        })
    }

    // about me section for user
    export function displayAboutMe(){
        console.log("About Me Section :)");
        db.collection("user").get() // gets the entire collection??
        .then(function(c){
            c.forEach(function(doc){
                let cheatMeal = doc.data().about.favCheatMeal;            
                console.log(cheatMeal);   
                let workout = doc.data().about.favWorkout;             
                console.log(workout);      
                let fitnessLevel = doc.data().about.fitnessLevel;             
                console.log(fitnessLevel);      
                let fitnessGoal = doc.data().about.fitnessGoal;             
                console.log(fitnessGoal);      
                let website = doc.data().about.website;             
                console.log(website);      
      
                document.getElementById('fav-cheatMeal-answer').innerText = cheatMeal;
                document.getElementById('fav-workout-answer').innerText = workout;
                document.getElementById('fav-fitnessGoals-answer').innerText = fitnessGoal;
                document.getElementById('fav-website-answer').innerText = website;
                document.getElementById('fav-fitnessLevel-answer').innerText = fitnessLevel;
            })
        })
    }
