import { firebaseConfig } from "/scripts/api/firebase_api_team37.js";
import { getEditProfAvatar } from "/scripts/util/getUserAvatar.js";
import { capitalizeWords } from "/scripts/util/capitalizeWords.js";

const db = firebase.firestore();
const userRef = db.collection("user");
const trainerOnlyRef = db.collection("trainerOnly");
 
export function updateLocation(latitude, longitude, cityFromGeo) {
    firebase.auth().onAuthStateChanged(function(user) {
        userRef.doc(user.uid).update({ 
            location: new firebase.firestore.GeoPoint(latitude, longitude),
            city: cityFromGeo,
        });
        trainerOnlyRef.doc(user.uid).update({
            location: new firebase.firestore.GeoPoint(latitude, longitude),
            // Address stores only the city not the full address
            address: cityFromGeo,
        });
    });
}

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


// Creates a document in schedule collection for the booked appointment
export function writeAppointmentSchedule(comments, dropdown, date, trainerID) {
    const scheduleRef = db.collection("schedule");

    firebase.auth().onAuthStateChanged(function(user) {
        userRef.doc(user.uid).get()
        .then(function (doc) {
            const firstName = doc.data().firstName;
            const lastName = doc.data().lastName;
            const profilePic = doc.data().profilePic;
            scheduleRef.add({
                date: date.value, // from jquery date picker
                time: dropdown.options[dropdown.selectedIndex].text, // String morning, afternoon, or evening
                completed: false, // boolean default false
                clientProfilePic: profilePic,
                clientFirstName: firstName,
                clientLastName: lastName,
                clientUserId: user.uid,
                trainerProfilePic: trainerID.profilePic,
                trainerFirstName: trainerID.firstName,
                trainerLastName: trainerID.lastName,
                trainerUserId: trainerID.userId,
                initialMsgFromClient: comments.value, // user input from comments form
                bookingMsg: trainerID.bookingMsg
            }).then(() => {
                window.location.href = "schedule.html";
            });
        })
    });
}

// Read the first name from db
export function personalizedWelcome(selector) {
    firebase.auth().onAuthStateChanged(function(user) {
        const userRefDoc = userRef.doc(user.uid);
        userRefDoc.get()
        .then((doc) => {
            if (user) {        
                // Set personalize welcome message
                return selector.innerText = doc.data().firstName;
            } else {
                // No user is signed in, give a place holder name.
                selector.innerText = "John Doe";
            }
        }).catch((err) => {
            // If doc is not yet created, get name from displayName rather than db
            console.log("Error: ", err);
            selector.innerText = user.displayName
        });
    });
}

// Creates document id with user uid in both user and trainerOnly collections
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
                    firstName: capitalizeWords(names[0]),
                    lastName: capitalizeWords(names[1]),
                    name: user.displayName,
                    fitnessGoals: "",
                    age: null,
                    phoneNumber: "",
                    gender: "",
                    location: null,
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
                    firstName: capitalizeWords(names[0]),
                    lastName: capitalizeWords(names[1]),
                    name: user.displayName,
                    location: null,
                    address: "",
                    profilePic: "",
                    gender: null,
                    website: "",
                    hourlyRate: null,
                    deposit: null,
                    firstSessionFree: null,
                    yearsOfExperience: null,
                    rating: null,
                    fitness: [],
                    wellness: [],
                    certifications: [], 
                    certificateImages: [],
                    availability: {
                        monday: [], 
                        tuesday: [],
                        wednesday: [],
                        thursday: [],
                        friday: [],
                        saturday: [],
                        sunday: []
                    },
                    bookingMsg: null,
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
            }).then(() => {
                window.location.href = "sign-up-profile-setup.html";
            });

        } else if (userRole == "client") {
            userDocRef.update({
                role:"client"
            }).then(() => {
                window.location.href = "sign-up-user-profile.html";
            });
        }
    });
}

// Checks if user has logged in before based on their role, if so redirect to schedule page
export const isFirstTime = () => {
    firebase.auth().onAuthStateChanged(user => {
        userRef.doc(user.uid).get()
            .then(doc => {
                let userRole = doc.data().role;
                if(userRole == undefined) {
                    return;
                } else {
                    window.location.href = "schedule.html";
                }
            })
    })
}   

// Displays trainer profile information. Parameters are references to a tag.
export function displayProfileInfo(fullName, phoneNum, bio, workout, cheatMeal, randFact, websiteUrl, radiusTravel, radiusDisplay, userCity) {
    firebase.auth().onAuthStateChanged(function(user) {
        userRef.doc(user.uid).get()
        .then(doc => {
            fullName.innerText = doc.data().name;
            phoneNum.value = doc.data().phoneNumber;
            bio.value = doc.data().about;
            workout.value = doc.data().favWorkout;
            cheatMeal.value = doc.data().favCheatMeal;
            randFact.value = doc.data().randomFact;
            radiusDisplay.innerText= doc.data().radius;

            if (doc.data().role == "trainer") {
                trainerOnlyRef.doc(user.uid).get()
                .then(trainerDoc => {
                    websiteUrl.value = trainerDoc.data().website;
                }).catch(err => {
                    // If doc is undefined, user is not a trainer
                    console.log("error: ", err);
                });
            }
        });
        // Update city field in real time 
        userRef.doc(user.uid)
        .onSnapshot(doc => {
            userCity.value = doc.data().city;
        })
    });
}

// Shows the selector if role is trainer
export function displayWebsiteField(selector) {
    firebase.auth().onAuthStateChanged(function(user) {
        userRef.doc(user.uid).get()
            .then(doc => {
                if (doc.data().role == "trainer") {
                    selector.style.display = "list-item";
                }
            })
    })
}

// Updates db when trainer clicks save and return. Parameters are references to a tag.
export function updateProfileInfo(websiteUrl, phoneNum, bio, workout, cheatMeal, randFact, radiusTravel) {
    firebase.auth().onAuthStateChanged(function(user) {
        userRef.doc(user.uid).update({
            // No option to update name
            phoneNumber: phoneNum.value,
            about: bio.value,
            favWorkout: workout.value,
            favCheatMeal: cheatMeal.value,
            randomFact: randFact.value,
            radius: radiusTravel.value,
        }).then(() => {
            userRef.doc(user.uid).get()
            .then(doc => {
                let role = doc.data().role;
                if (role == "trainer") {
                    updateTrainerInfo(websiteUrl);
                } else {
                    window.location.href = "schedule.html";
                }
            })
        })
    });
}

function updateTrainerInfo(websiteUrl = "") {
    firebase.auth().onAuthStateChanged(function(user) {
        trainerOnlyRef.doc(user.uid).update({
            website: websiteUrl.value
        }).then(() => {
            window.location.href = "sign-up-profile-setup.html";
        }).catch(err => {
            console.log("Error: ", err);
        });
    });
}

export function uploadProfileImg(imgPath, imgSelector) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Reference to logged in user specific storage
        let storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");
        // Upload user selected file to cloud storage
        storageRef.put(imgPath);
        // Gets firebase storage url and updates respective field in document of user.uid
        storageRef.getDownloadURL()
            .then((url) => {
                userRef.doc(user.uid).update({
                    profilePic: url,
                });
                trainerOnlyRef.doc(user.uid).update({
                    profilePic: url,
                });
            }).then(() => {
                displayUserProfileImg(imgSelector);
            }).then(() => {
                setTimeout(() => {
                    document.location.reload();
                }, 250)
            }).catch(err => {
                console.log("Error: " + err);
            });
    })
}

export async function displayUserProfileImg(selector) {
    firebase.auth().onAuthStateChanged(async (user) => {      
        let ref = await userRef.doc(user.uid).get();
        let first = ref.data().firstName;
        let last = ref.data().lastName;
        let profileP = ref.data().profilePic; 

        getEditProfAvatar({firstName: first, lastName: last, parentNode: selector, profilePicPath: profileP});
    })
}

export function uploadCertImg(imgPath, selector) {
    firebase.auth().onAuthStateChanged(function(user) {
        // Reference to logged in user specific storage
        let storageRef = firebase.storage().ref("certificates/" + user.uid + ".jpg");
        // Upload user selected file to cloud storage
        storageRef.put(imgPath);
        // Gets firebase storage url and updates respective field in document of user.uid
        storageRef.getDownloadURL()
        .then((url) => {
            trainerOnlyRef.doc(user.uid).update({
                certificateImages: firebase.firestore.FieldValue.arrayUnion(url),
            })
        }).then(() => {
            // Shows modal after user uploads certificate
            var myModal = new bootstrap.Modal(selector);
            myModal.show();
        }).catch(err => {
            console.log("Error: " + err);
        });
    })
}


export function updateExpertise(certTitle, yearsExp, fitnessList, wellnessList) {
    firebase.auth().onAuthStateChanged(function(user) {
        trainerOnlyRef.doc(user.uid).update({
            certifications: firebase.firestore.FieldValue.arrayUnion(certTitle.value),
            // Convert String to int before updating
            yearsOfExperience: parseInt(yearsExp.value, 10),
            fitness: fitnessList,
            wellness: wellnessList,
        }).then(() => {
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
            deposit: Number(depositMin.value),
            firstSessionFree: freeSession.checked,
            bookingMsg: preBookingMsg.value,
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
            preBookingMsg.value = doc.data().bookingMsg;
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

// Display the selected trainer's name and their initial booking message
export function displayBookInfo(trainerID) {
    document.getElementById("trainerFirstName").innerText = trainerID.firstName;
    if (trainerID.bookingMsg === null) {
        document.getElementById("bookingMsg").display = "none";
    } else {
        document.getElementById("bookingMsg").innerText = trainerID.bookingMsg;
    }
}

// Returns an array of documents given certain params
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

// Adds or updates a single field in a document
export const addSingleField = (doc, collectionName) => {
    const ref = db.collection(collectionName);
    let fieldToUpdate = {};
    fieldToUpdate[doc.field] = doc.value;

    ref.doc(doc.id).set(fieldToUpdate, { merge: true })
    .then(() => console.log("Successfully updated document!"))
    .catch((e) => console.log(e));
}

// Used in generation of fake data:
// Creates many documents at once
export const massWriteDocuments = (arr, collectionName) => {
    const ref = db.collection(collectionName);

    arr.forEach(el => {
        ref.doc(el.userId).set(el)
        .then(() => {
            console.log("Successfully added documents");
        })
        .catch((e) => {
            console.log(e);
        })
    })
}

// Used in generation of fake data:
// Updates a single field in a group of documents
export const massUpdateDocuments = (arr, collectionName) => {
    const ref = db.collection(collectionName);

    arr.forEach(el => {
        let updatedField = {};
        updatedField[el.field] = el.value;

        ref.doc(el.id).set(updatedField, {merge: true})
        .then(() => console.log("Successfully updated document!"))
        .catch((e) => console.log(e));
    });
}

// Given a uid param...
// Return its corresponding user doc in the db
export const getUser = async (uid) => {
    const userDetails = await userRef.doc(uid).get();
    return userDetails.data();
}

export const logOutUser = async () => {
    return await firebase.auth().signOut();
}

// If the user is logged in ...
// retrieve their corresponding user document in the db...
// and put in localStorage
// If the user is not logged in and there is a user in localStorage...
// remove user
export const getLoggedUser = () => {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            const loggedUser = await getUser(user.uid);
            localStorage.setItem("user", JSON.stringify(loggedUser));
        } else {
            localStorage.getItem("user") && localStorage.removeItem("user");
        }
    })
}

// Query through the schedules collection to generate an array...
// of booked time slots for the selected trainer
export const getScheduleInfo = (trainerId) => {
    // Find all appointments scheduled with the given trainer
    let query = db.collection("schedule").where("trainerUserId", "==", trainerId.userId);

    let bookedSlots = [];
    
    // Write date and time of respective appointments into an array
    query.onSnapshot(function(c){
        c.forEach(function(doc){
            // Format date to appropriate format
            let date = new Date(doc.data().date);
            const year = date.getFullYear();
            const month = ("" + (date.getMonth() + 1)).slice(-2);
            const day = ("" + (date.getDate())).slice(-2);
            const formatted = month + '/' + day + '/' + year;

            let bookedDate = formatted;
            let bookedTime = doc.data().time;
            bookedSlots.push({date : bookedDate, time : bookedTime});
        })
    })

    return bookedSlots;
}