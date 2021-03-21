// Sprint 2: reading/writing to firebase
import { firebaseConfig } from "/scripts/api/firebase_api_team37.js";
// firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Get user collection in firestore
const userCollect = db.collection("user");

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

export function createUser() {
    // Only authenticated users, can be set in firebase console storage "rules" tab
    firebase.auth().onAuthStateChanged(function(user) {
        const userRef = userCollect.doc(user.uid);
        
        userRef.get()
            .then((docSnapshot) => {
                if(!docSnapshot.exists) {
                    let names = user.displayName.split(" ", 2);
                    userCollect.doc(user.uid).set({
                        userId: user.uid,
                        email: user.email,
                        name: {
                            first: names[0],
                            last: names[1]
                        }, 
                        role: null,
                    })
                }
            })
    });
}

export function setUserRole(userRole) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (userRole == "trainer") {
            return userCollect.doc(user.uid).update({
                role: "trainer"
            });
        } else if (userRole == "client") {
            return userCollect.doc(user.uid).update({
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
