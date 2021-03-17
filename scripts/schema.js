// will use this for editing trainer profile
var trainer = {
    age: -1, // integer
    email: "",
    firstSessionFree: null, // boolean
    gender: "", // String male, female, other, or prefer not to say
    hourlyRate: 0, // integer
    location: new firebase.firestore.Geopoint(37.422, 122.084), // Retrieved automatically
     // String, link to website
    rating: -1, // integer, range 1 - 5
    totalClients: -1, // integer
    totalSessions: -1, // integer
    profilePic: "./profile-pic.jpg", // String path to file?
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
        time: ["morning", "afternoon", "evening"]
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
    role: "" // String, client or trainer or null, if they haven't set it yet
};

// use this for seeing user profiles
var userProfile = {
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
    location: "",
    completed: false, // boolean default false
    sessionTitle: "",
    clientProfilePic: "",
    clientFirstName: "",
    clientLasttName: "",
    trainerProfilePic: "",
    trainerFirstName: "",
    trainerLasttName: "",
    confirmationId: "",

    appointments: 
    [
        {
            date: new firebase.firestore.Timestamp.now(), // returns Timestamp object
            time: "", // String, morning or afternoon or evening
            available: true // boolean
        },
        {
            date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")),
            time: "", // String, morning or afternoon or evening
            available: false   // boolean
        }
    ],
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
