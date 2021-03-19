// will use this for editing trainer profile
export const fitnessOptions = [
    "bpdy building", "power lifting", "crossfit", "yoga", "pilates", "cycling", "boxing / kickboxing", 
"climbing", "tai chi", "outdoor", "dance", "endurance"];
export const wellnessOptions = [
    "nutrition", "macro coaching", "physical therapy", "chiropractor", "body treatments", "weight loss", "custom workout regimen"]

const trainer = {
    user_id: "",
    age: -1, // integer
    email: "",
    gender: "", // String male, female, other, or prefer not to say
    location: new firebase.firestore.Geopoint(37.422, 122.084), // Retrieved automatically
     // String, link to website
    rating: -1, // integer, range 1 - 5
    totalClients: -1, // integer
    totalSessions: -1, // integer
    profilePic: "/images/profile-placeholder.svg", // String path to file?
    certification: "path to file?",
    yearsOfExperience: 0, // integer
    expertise: {
        fitness: [
            "body building",
            "power lifting"
        ],
        wellness: [
            "macro coaching",
            "therapy"
        ]
    },
    name: {
        first: "",
        last: ""
    },
    platformSpecific: {
        hourlyRate: 0, // integer
        deposit: 0,
        firstSessionFree: null, // boolean
    },
    posts: [
        {
            date: new firebase.firestore.Timestamp.now(),
            message: "Hello world!"
        }
    ],
    socialMedia: {
        facebook: "facebook.com/trainermike", // String, link to social media
        instagram: "instagram.com/trainermike", // String, link to social media
        website: "https://trainermike.com"
    },
    bookingMsg: "If this is your first session with me, please make sure to include your fitness goals. Additional information I will need includes your BMI, any dietary restrictions, and any specific muscles you would like to target. Thank you!"
}


// User includes both trainer and client
const user = {
    user_id: "",
    age: -1, // integer
    email: "",
    name: {
        first: "",
        last: ""
    },
    fitnessGoals: [
        "", 
        "",
        ""
    ],
    favCheatMeal: "",
    favWorkout: "",
    fitnessLevel: "",
    gender: "", // String male or female or other or prefer not to say
    location: new firebase.firestore.Geopoint(37.422, 122.084), // Retrieved automatically
    profilePic: "", //uploaded by the user
    rating: -1, // integer, range 1 - 5
    role: "", // String, client or trainer or null, if they haven't set it yet
};


// use this for seeing user profiles
const userProfile = {
    user_id: "",
    name: {
        first: "",
        last: ""
    },
    city: "", //extract from geolocation
    totalClients: 0, 
    totalSessions: 0,
    about: {
        favCheatMeal: "",
        favWorkout: "",
        fitnessLevel: "",
        fitnessGoal: "",
        website: ""
    },
    updates: {
        title: "",
        date: new firebase.firestore.Timestamp.now(),
        content: ""
    },
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


// use this for my schedule page
const appointments = {
    // Get this from jquery date picker
    date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")), // Timestamp
    time: "", // String morning, afternoon, or evening
    // location: "",
    completed: false, // boolean default false
    // sessionTitle: "",
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


// use subcollection or root level collections structured data
const conversations = [
    {
        messages: [
            {
                fromUser: "id1", 
                toUser: "id2",
                date: "Timestamp",
                message: "Blahbbity blah",
                seen: false // how do ???
            }
        ],
        users: [
            "id1",
            "id2"
        ],
    }
];


// appointments: 
// [
//     {
//         date: new firebase.firestore.Timestamp.now(), // returns Timestamp object
//         time: "", // String, morning or afternoon or evening
//         available: true // boolean
//     },
//     {
//         date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")),
//         time: "", // String, morning or afternoon or evening
//         available: false   // boolean
//     }
// ],


// appointments (collection)
//     upcoming (document)
//         ... what we currently have ...

//     trainerAvailability (document)
//         traineName:...
//         generalAvailability:...
//         trainerUpcoming:...
