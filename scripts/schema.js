// will use this for editing trainer profile
var trainer = {
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
    expertise: {
        certification: "path to file?",
        yearsOfExperience: 0, // integer
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
        generalAvailability: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        time: ["morning", "afternoon", "evening"],
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
}


// User includes both trainer and client
var user = {
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
    confirmationId: [
        "",
        ""
    ]
};


// use this for seeing user profiles
var userProfile = {
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
var appointments = {
    date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")), // Timestamp
    time: "", // String morning, afternoon, or evening
    location: "",
    completed: false, // boolean default false
    sessionTitle: "",
    clientProfilePic: "",
    clientFirstName: "",
    clientLasttName: "",
    client_user_id: "", //user_id
    trainerProfilePic: "",
    trainerFirstName: "",
    trainerLasttName: "",
    trainer_user_id: "", //user_id
    confirmationId: "",
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
