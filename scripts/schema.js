// will use this for editing trainer profile
export const fitnessOptions = [
    "body building", "power lifting", "crossfit", "yoga", "pilates", "cycling", "boxing / kickboxing", 
"climbing", "tai chi", "outdoor", "dance", "endurance"
];
export const wellnessOptions = [
    "nutrition", "macro coaching", "physical therapy", "chiropractor", "body treatments", "weight loss", "custom workout regimen"
];
export const availabilityDays = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

// User includes both trainer and client
const user = {
    userId: "",
    firstName: "",
    lastName: "",
    name: "",
    fitnessGoals: "my fitness goal",
    age: -1, // integer
    email: "",
    phoneNumber: "", // String
    gender: "",
    location: new firebase.firestore.GeoPoint(37.422, 122.084), //Retrieve automatically
    favCheatMeal: "",
    favWorkout: "",
    fitnessLevel: "",
    gender: "", // String male or female or other or prefer not to say
    location: new firebase.firestore.GeoPoint(37.422, 122.084), // Retrieved automatically
    profilePic: "", //uploaded by the user
    rating: null, // integer, range 1 - 5
    facebook: "",
    instagram: "",
    role: "", // String, client or trainer or null, if they haven't set it yet
    about: "",
    randomFact: "",
    radius: null,
}

// Use for filtering
const trainerOnly = {
    userId: "",
    firstName: "",
    lastName: "",
    name: "",
    website: "",
    hourlyRate: null,
    deposit: null,
    firstSessionFree: null,
    yearsOfExperience: null,
    rating: null,
    fitness: fitnessOptions,
    wellness: wellnessOptions,
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
}

const openSlots = {
    trainerId: "",
    slots: [
        {
            date: "",
            time: ""            
        }
    ]
    // expired slots should automatically be removed
    // when slots are booked, remove slot ...
    // ... and write to schedule collection
}

// Use this for user profiles with "updates"
const posts = {
    userId: "",
    date: new firebase.firestore.Timestamp.now(),
    title: "Message Title",
    message: "Hello world!"
}

// use this for seeing both types of user profiles
const userProfile = {
    userId: "",
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
    clientUserId: "", //user_id
    trainerProfilePic: "",
    trainerFirstName: "",
    trainerLastName: "",
    trainerUserId: "", //user_id
    initialMsgFromClient: "",
    bookingMsg: ""
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
