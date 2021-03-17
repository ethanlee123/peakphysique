const trainer = {
    firstName: "firstName1",
    lastName: "lastName1",
    location: new firebase.firestore.Geopoint(37.422, 122.084),
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
            date: new firebase.firestore.Timestamp.fromDate(new Date("March 16 2021")),
            time: "Afternoon",
            available: false
        }
    ],
    yearsOfExperience: 3,
    totalClients: 5,
    totalSessions: 10,
    posts: [
        {
            date: new firebase.firestore.Timestamp.now(),
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
}

const user = {
    firstName: "firstName2",
    lastName: "lastName2",
    email: "user@email.com",
    role: "Client", // or trainer or null, if they haven't set it yet
    profilePic: "",
    gender: "Male",
    age: 25,
    location: "37.422, 122.084",
    fitnessGoals: [
        "Curl 100 lbs",
        "Bench 2 plates",
        "Squat 350 lbs"
    ],
    fitnessLevel: "Beginner",
    favWorkout: "Running",
    favMeal: "Pizza", 

    rating: "5" // range 1 - 5
}

const conversations = [
    {
        users: [
            "id1",
            "id2"
        ],
        messages: [
            {
                fromUser: "id1",
                date: "Timestamp",
                message: "Blahbbity blah",
                seen: false // how do ???
            }
        ]
    }
];
