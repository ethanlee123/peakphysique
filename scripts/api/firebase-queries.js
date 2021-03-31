import { firebaseConfig } from "/scripts/api/firebase_api_team37.js";
// import { reverseGeo } from "/scripts/api/here_api.js"

const db = firebase.firestore();
const storage = firebase.storage;

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

// creates a document in schedule collection for the booked appointment
export function writeAppointmentSchedule() {
    var scheduleRef = db.collection("schedule");

    var user = firebase.auth().currentUser;

    scheduleRef.add({
        // Get this from jquery date picker
        date: date.value, // Timestamp
        time: timeSlot.value, // String morning, afternoon, or evening
        // location: "",
        completed: false, // boolean default false
        clientProfilePic: user.profilePic,
        clientFirstName: user.firstName,
        clientLastName: user.lastName,
        clientUserId: user.uid, //user_id
        trainerProfilePic: trainerId.profilePic,
        trainerFirstName: trainerId.firstName,
        trainerLastName: trainerId.lastName,
        trainerUserId: trainerId, //user_id
        initialMsgFromClient: comments.value, //user input from comments form
        bookingMsg: trainerId.bookingMsg //pull from trainer collection
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
                return selector.innerText = doc.data().firstName;
            } else {
                // No user is signed in.
                selector.innerText = "John Doe";
                console.log("user is not signed in");
            }
        }).catch((err) => {
            // If doc is not yet created, get name from displayName rather than db
            console.log("Error: ", err);
            selector.innerText = user.displayName
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
        userRef.doc(user.uid).update({ 
            location: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude),
        });
    });
    console.log(position.coords.longitude);
    console.log(position.coords.latitude);

    // reverseGeo(position.coords.latitude, position.coords.longitude);
}
// Support: callback function for getLocation()
function blockedLocation(error) {
    if(error.code == 1) {
        alert("Allowing locations helps us show you people near you");
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
                    about: null,
                    randomFact: null,
                    radius: null,
                    city: null,
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
                    },
                    bookingMessage: null,
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

// Displays trainer profile information. Parameters are references to a tag.
export function displayProfileInfo(fullName, phoneNum, bio, workout, cheatMeal, randFact, websiteUrl, radiusTravel, radiusDisplay) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from trainerOnly collection
        trainerOnlyRef.doc(user.uid).get()
        .then(trainerDoc => {
            websiteUrl.value = trainerDoc.data().website;
        }).catch(err => {
            // If doc is undefined, user is not a trainer
            console.log("error: ", err);
        });

        // Get doc from user collection
        userRef.doc(user.uid).get()
        .then(doc => {
            fullName.innerText = doc.data().name;
            phoneNum.value = doc.data().phoneNumber;
            // city.value = doc.data().city;
            bio.value = doc.data().about;
            workout.value = doc.data().favWorkout;
            cheatMeal.value = doc.data().favCheatMeal;
            randFact.value = doc.data().randomFact;
            radiusDisplay.innerText= doc.data().radius;
            userCity.value = doc.date().city;
        });
    });
}

// Updates db when trainer clicks save and return. Parameters are references to a tag.
export function updateProfileInfo(websiteUrl, phoneNum, bio, workout, cheatMeal, randFact, radiusTravel) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from user collection
        userRef.doc(user.uid).update({
            // No option to update name
            phoneNumber: phoneNum.value,
            // city: userCity.value,
            about: bio.value,
            favWorkout: workout.value,
            favCheatMeal: cheatMeal.value,
            randomFact: randFact.value,
            radius: radiusTravel.value,
        }).then(() => {
            updateTrainerInfo(websiteUrl);
            console.log("updateTrainerInfo called");
        })
    });
}

function updateTrainerInfo(websiteUrl = "") {
    firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from trainerOnly collection
        trainerOnlyRef.doc(user.uid).update({
            website: websiteUrl.value,
        }).then(() => {
            console.log("successfully update user website url");
            window.location.href = "sign-up-profile-setup.html";
        }).catch(err => {
            console.log("error: ", error);
        });
    });
}

export function uploadProfileImg(imgPath) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Reference to logged in user specific storage
        let storageRef = storage.ref("images/" + user.uid + ".jpg");
        // Upload user selected file to cloud storage
        storageRef.put(imgPath);
        // Gets firebase storage url and updates respective field in document of user.uid
        storageRef.getDownloadURL()
        .then((url) => {
            userRef.doc(user.uid).update({
                profilePic: url,
            })
        })
    })
}

// export function displayScheduleInfo(trainerFirstName, trainerLastName, apptTime, apptDate) {
export function updateExpertise(certTitle, yearsExp, fitnessList, wellnessList) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Get doc from trainerOnly collection
        trainerOnlyRef.doc(user.uid).update({
            // For now you can only add one certificate
            certifications: firebase.firestore.FieldValue.arrayUnion(certTitle.value),
            // Convert String to int before updating
            yearsOfExperience: parseInt(yearsExp.value, 10),
            fitness: fitnessList,
            wellness: wellnessList,
        }).then(() => {
            console.log("successfully update trainerOnly collection");
            window.location.href = "sign-up-profile-setup.html";
        }).catch(err => {
            console.log("error: ", error);
        });
    });
}

// Parameters are references to a tag.
export function displayExpertise(yearsExp, fitnessInp, wellnessInp) {
    firebase.auth().onAuthStateChanged(function(user) {
        var fitnessSpcList = [];
        var wellnessServList = [];
        // Get doc from trainerOnly collection
        trainerOnlyRef.doc(user.uid).get()
        .then((doc) => {
            // Convert String to int before updating
            yearsExp.value = doc.data().yearsOfExperience;
            fitnessSpcList = doc.data().fitness;
            wellnessServList = doc.data().wellness;
        }).then(() => {
            // Iterate through nodeList of input tags
            fitnessInp.forEach((input) => {
                // Returns a nodeList of label tags, get lower case text of label
                let text = input.labels[0].innerText.toLowerCase();
                // Checks if text is a value of fitnessList
                if (fitnessSpcList.includes(text)) {
                    input.checked = true;
                }
            })
            // Iterate through nodeList of input tags
            wellnessInp.forEach((input) => {
                // Returns a nodeList of label tags, get lower case text of label
                let text = input.labels[0].innerText.toLowerCase();
                // Checks if text is a value of fitnessList
                if (wellnessServList.includes(text)) {
                    input.checked = true;
                }
            })
        }).catch(err => {
            console.log("error: ", err);
        });
    });
}

// Parameters are references to a tag.
export function updatePlatformSpecifics(rate, depositMin, freeSession, preBookingMsg) {
    firebase.auth().onAuthStateChanged(function(user) {
        trainerOnlyRef.doc(user.uid).update({
            hourlyRate: rate.value,
            deposit: depositMin.value,
            firstSessionFree: freeSession.checked,
            bookingMessage: preBookingMsg.value,
        }).then(() => {
            console.log("successfully update trainerOnly collection");
            window.location.href = "sign-up-profile-setup.html";
        })
    })
}

// Parameters are references to a tag.
export function displayPlatformSpecifics(rate, depositMin, freeSession, preBookingMsg) {
    firebase.auth().onAuthStateChanged(function(user) {
        trainerOnlyRef.doc(user.uid).get()
        .then(doc => {
            rate.value = doc.data().hourlyRate;
            depositMin.value = doc.data().deposit;
            preBookingMsg.value = doc.data().bookingMessage;
            // Returns a boolean value
            freeSession.value = doc.data().firstSessionFree;
        }).then(() => {
            // Displays checkbox as (un)checked based on freeSession.value
            if (freeSession.value) {
                freeSession.checked = true;
            } else {
                freeSession.checked = false;
            }
        }).catch(err => {
            console.log("error: ", err);
        });
    })
}

export function displayScheduleInfo(){
    console.log("Schedule Info! :)");
    db.collection("schedule").get()
    .then(function(s){
        s.forEach(function(doc){
            trainerFirstName.innerText = doc.data().trainerFirstName;            
            console.log(trainerFirstName);
            trainerLastName.innerText  = doc.data().trainerLastName;            
            console.log(trainerLastName);
            apptTime.innerText = doc.data().time;            
            console.log(time);
            apptDate.innerText = doc.data().date;            
            console.log(date);
            // let bookingMsg = doc.data().bookingMsg;            
            // console.log(bookingMsg);                             // trainer booking msg or client msg???

            let completed = doc.data().completed;
            console.log(completed);                                 // completed appointment

            // document.getElementById('trainerFirstName').innerText = trainerFirstName;
            // document.getElementById('trainerLastName').innerText = trainerLastName;
            // document.getElementById('appt-time').innerText = time;
            // document.getElementById('appt-date').innerText = date;


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

export function displayBookInfo() {
    db.collection("schedule").get()
    .then(function (q) {
        q.forEach(function (doc) {
          var trainerFirstName = doc.data().trainerFirstName;
          console.log(trainerFirstName);
          var bookingMsg = doc.data().bookingMsg;
          console.log(bookingMsg);
          // var clientID = doc.data().client_user_id;
          // console.log(clientID);
          // var trainerID = doc.data().trainer_user_id;
          // console.log(trainerID);
          document.getElementById("trainerFirstName").innerText = trainerFirstName;
          document.getElementById("bookingMsg").innerText = bookingMsg;
        })
    })
}

export function getTrainerAvailability() {
    trainerOnlyRef.doc("trainerID").get()
    .then((doc) => {
        var availability = doc.data().availability;
        console.log(availability);
        return availability;
    });
}

export const getCollection = async ({
    collectionName,
    sort = null,
    limit = null,
    filters = null,
    startAfter = null
}) => {
    let query = db.collection(collectionName);

    query = sort ? query.orderBy(sort.by, sort.order) : query;
    query = startAfter ? query.orderBy(sort.by, sort.order) : query;
    query = limit ? query.limit(limit) : query; 
 
    filters && filters.forEach((filter) => {
        if (filter) {
            query = query.where(filter.field, filter.operator,
                    filter.value);
        }
    });
 
    let collection = await query.get();
    return collection.docs.map(doc => {
        return doc.data();
    });
}

export const massWriteTrainers = (trainerArr) => {
    trainerArr.forEach(trainer => {
        trainerOnlyRef.doc(trainer.userId).set(trainer)
        .then(() => {
            console.log("Successfully added trainers.");
        })
        .catch((e) => {
            console.log(e);
        })
    })
}

export const getUser = async (uid) => {
    const userDetails = await userRef.doc(uid).get();
    return userDetails.data();
}

export const logOutUser = async () => {
    return await firebase.auth().signOut();
}