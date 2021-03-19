// will use this for editing trainer profile
export const fitnessOptions = [
    "bpdy building", "power lifting", "crossfit", "yoga", "pilates", "cycling", "boxing / kickboxing", 
"climbing", "tai chi", "outdoor", "dance", "endurance"];
export const wellnessOptions = [
    "nutrition", "macro coaching", "physical therapy", "chiropractor", "body treatments", "weight loss", "custom workout regimen"]

// const trainer = {
//     user_id: "",
//     age: -1, // integer
//     email: "",
//     gender: "", // String male, female, other, or prefer not to say
//     location: new firebase.firestore.Geopoint(37.422, 122.084), // Retrieved automatically
     // String, link to website
    // rating: -1, // integer, range 1 - 5
    // profilePic: "/images/profile-placeholder.svg", // String path to file?
    // certification: ["title of certificate1", "title of certificate2"],
    // yearsOfExperience: 0, // integer
//     fitness: fitnessOptions,
//     wellness: wellnessOptions,
//     name: {
//         first: "",
//         last: ""
//     },
//     platformSpecific: {
//         hourlyRate: 0, // integer
//         deposit: 0,
//         firstSessionFree: null, // boolean
//     },
//     socialMedia: {
//         facebook: "facebook.com/trainermike", // String, link to social media
//         instagram: "instagram.com/trainermike", // String, link to social media
//         website: "https://trainermike.com"
//     },
//     // bookingMsg: "If this is your first session with me, please make sure to include your fitness goals. Additional information I will need includes your BMI, any dietary restrictions, and any specific muscles you would like to target. Thank you!"
// }


// User includes both trainer and client
const user = {
    userId: "",
    name: {
        first: "",
        last: ""
    },
    fitnessGoals: "my fitness goal",
    age: -1, // integer
    email: "",
    phoneNumber: "7785782460", // String
    gender: "",
    location: new firebase.firestore.Geopoint(37.422, 122.084), //Retrieve automatically
    favCheatMeal: "",
    favWorkout: "",
    fitnessLevel: "",
    gender: "", // String male or female or other or prefer not to say
    location: new firebase.firestore.Geopoint(37.422, 122.084), // Retrieved automatically
    profilePic: "", //uploaded by the user
    rating: -1, // integer, range 1 - 5
    facebook: "",
    instagram: "",
    role: "", // String, client or trainer or null, if they haven't set it yet
};

// Use for filtering
const trainerOnly = {
    userId: "",
    website: "url",
    hourlyRate: -1,
    deposit: -1,
    firstSessionFree: null, // boolean
    yearsOfExperience: -1,
    rating: -1,
    fitness: fitnessOptions,
    wellness: wellnessOptions,
    certifications: ["title of certification"],
    name: {
        first: "",
        last: ""
    }
    // bookingMsg: "" 

}

// Use this for user profiles with "updates"
const posts = {
    user_id: "",
    date: new firebase.firestore.Timestamp.now(),
    message: "Hello world!"
}

// use this for seeing both types of user profiles
const userProfile = {
    user_id: "",
    name: {
        first: "",
        last: ""
    },
    city: "", //extract from geolocation
    totalClients: 0, // firestore has an "increment" method
    totalSessions: 0,
    about: { // Create this as a sub collection
        favCheatMeal: "",
        favWorkout: "",
        fitnessLevel: "",
        fitnessGoal: "",
        website: ""
    },
    // updates: Get these from const posts
    hourlyRate: 0,
    fitness: [
        "",
        ""
    ],
    wellness: [
        "",
        ""
    ],
    certifications: [
        "",
        ""
    ]
}


// use this for my schedule page and book appointment page for both types of users
const schedule = {
    // Get this from jquery date picker
    date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")), // Timestamp
    time: "", // String morning, afternoon, or evening
    // location: "",
    completed: false, // boolean default false
    clientProfilePic: "",
    clientFirstName: "",
    clientLasttName: "",
    client_user_id: "", //user_id
    trainerProfilePic: "",
    trainerFirstName: "",
    trainerLasttName: "",
    trainer_user_id: "", //user_id
    initialMsgFromClient: ""
}


// use root level collections structured data
      //Collection
const conversations = { 
    // Document
    user: { //user_id = "" the currently logged in user
        //Collection
        messages : {
            fromUserId: "",
            from: "",
            content: "",
            timestamp: ""
        }
    }
}
