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
  db.collection("trainer").get() // gets the entire collection??
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
          let hourlyRate = doc.data().platformSpecific.hourlyRate;
          console.log(hourlyRate);
          let services = doc.data().platformSpecific.services;
          console.log(services);
          let expertise = doc.data().platformSpecific.expertise;
          console.log(expertise);
          let certifications = doc.data().platformSpecific.certifications;
          console.log(certifications);
          let location = doc.data().location;
          console.log(location);
          document.getElementById('trainerFirstName').innerText = trainerFirstName;
          document.getElementById('trainerLastName').innerText = trainerLastName;
          document.getElementById('totalClients').innerText = totalClients;
          document.getElementById('totalSessions').innerText = totalSessions;
          document.getElementById('hourlyRate').innerText = hourlyRate;
          document.getElementById('services').innerText = services;
          document.getElementById('expertise').innerText = expertise;
          document.getElementById('certifications').innerText = certifications;
          document.getElementById('location').innerText = location;

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

export function personalizedWelcome(selector) {
    // Only authenticated users, can be set in firebase console storage "rules" tab
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
            // Set personalize welcome message
            selector.innerText = user.displayName;
        } else {
            // No user is signed in.
            console.log("user is not signed in");
        }
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
