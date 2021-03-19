// Sprint 2: reading/writing to firebase
const db = firebase.firestore();

function displayTrainerInfo(){
  console.log("hello from displayTrainerInfo! :)");
  db.collection("trainer").get() // gets the entire collection??
  .then(function(c){
      c.forEach(function(doc){
          let trainerFirstName = doc.data().firstName;             //gets the first name field
          console.log(trainerFirstName);
          let trainerLastName = doc.data().lastName;             //gets the last name field
          console.log(trainerLastName);
          let totalClients = doc.data().totalClients;        //gets the totalClients ID field
          console.log(totalClients);
          let totalSessions = doc.data().totalSessions;        //gets the totalSessions ID field
          console.log(totalSessions);
          document.getElementById(trainerFirstName).innerText = trainerFirstName;
          document.getElementById(trainerLastName).innerText = trainerLastName;
          document.getElementById(totalClients).innerText = totalClients;
          document.getElementById(totalSessions).innerText = totalSessions;
      })

  })
}
// displayTrainerInfo();

// ### Test data ... delete later ###
const trainersTest = [
    {
        user_id: "",
        age: 19,
        email: "email@example.com",
        gender: "male",
        location: new firebase.firestore.GeoPoint(37.422, 122.084),
        rating: 3,
        totalClients: 11,
        totalSessions: 51,
        profilePic: "https://i.dailymail.co.uk/1s/2021/03/03/23/40017992-9323427-image-m-25_1614815098810.jpg",
        certification: [
            {
                name: "",
                file: ""
            }
        ],
        yearsOfExperience: 7,
        expertise: {
            fitness: [
                "body building",
                "power lifting"
            ],
            wellness: [
                "macro coaching",
                "physical therapy"
            ]
        },
        name: {
            first: "Fabio",
            last: "the Fabiolous"
        },
        platformSpecific: {
            hourlyRate: 87, // integer
            deposit: 0,
            firstSessionFree: false, // boolean
        },
        posts: [
            {
                date: new firebase.firestore.Timestamp.now(),
                message: "Hello world!"
            }
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike",
            website: "https://trainermike.com"
        },
        bookingMsg: "I don't sign autographs sweetie."
    },
    {
        user_id: "",
        age: 35,
        email: "email@example.com",
        gender: "male",
        location: new firebase.firestore.GeoPoint(37.422, 122.084),
        rating: 2,
        totalClients: 11,
        totalSessions: 51,
        profilePic: "https://pbs.twimg.com/profile_images/1407346896/89.jpg",
        certification: [
            {
                name: "",
                file: ""
            }
        ],
        yearsOfExperience: 12,
        expertise: {
            fitness: [
                "crossfit",
            ],
            wellness: []
        },
        name: {
            first: "Chuck",
            last: "Norris"
        },
        platformSpecific: {
            hourlyRate: 12, // integer
            deposit: 0,
            firstSessionFree: true, // boolean
        },
        posts: [
            {
                date: new firebase.firestore.Timestamp.now(),
                message: "Hello world!"
            }
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike",
            website: "https://trainermike.com"
        },
        bookingMsg: "Heck yes"
    },
    {
        user_id: "",
        age: 87,
        email: "email@example.com",
        gender: "male",
        location: new firebase.firestore.GeoPoint(37.422, 122.084),
        rating: 5,
        totalClients: 11,
        totalSessions: 51,
        profilePic: "https://pbs.twimg.com/profile_images/1267571352669585408/ZSKWcU-i_400x400.jpg",
        certification: [
            {
                name: "",
                file: ""
            }
        ],
        yearsOfExperience: 12,
        expertise: {
            fitness: [
                "yoga",
                "endurance training"
            ],
            wellness: []
        },
        name: {
            first: "Reinhardt",
            last: "Meows"
        },
        platformSpecific: {
            hourlyRate: 451, // integer
            deposit: 0,
            firstSessionFree: false, // boolean
        },
        posts: [
            {
                date: new firebase.firestore.Timestamp.now(),
                message: "Hello world!"
            }
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike",
            website: "https://trainermike.com"
        },
        bookingMsg: "HONOUR! JUSTICE! REINHARDT REINHARDT REINHARDT!"
    },
    {
        user_id: "",
        age: 87,
        email: "email@example.com",
        gender: "female",
        location: new firebase.firestore.GeoPoint(37.422, 122.084),
        rating: 1,
        totalClients: 11,
        totalSessions: 51,
        profilePic: "https://cdn.flickeringmyth.com/wp-content/uploads/2021/02/WandaVision-poster-80s-1.jpg",
        certification: [
            {
                name: "",
                file: ""
            }
        ],
        yearsOfExperience: 12,
        expertise: {
            fitness: [],
            wellness: [
                "custom workout regimen"
            ]
        },
        name: {
            first: "Agatha",
            last: "All Along"
        },
        platformSpecific: {
            hourlyRate: 451, // integer
            deposit: 0,
            firstSessionFree: false, // boolean
        },
        posts: [
            {
                date: new firebase.firestore.Timestamp.now(),
                message: "Hello world!"
            }
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike",
            website: "https://trainermike.com"
        },
        bookingMsg: "And I killed Sparky too!"
    },
    {
        user_id: "",
        age: 24,
        email: "email@example.com",
        gender: "male",
        location: new firebase.firestore.GeoPoint(37.422, 122.084),
        rating: 4,
        totalClients: 11,
        totalSessions: 51,
        profilePic: "https://i.pinimg.com/originals/8c/e7/92/8ce7928fd40867ee39e5c98f5a87e336.jpg",
        certification: [
            {
                name: "",
                file: ""
            }
        ],
        yearsOfExperience: 12,
        expertise: {
            fitness: [
                "pilates"
            ],
            wellness: []
        },
        name: {
            first: "This",
            last: "Dude"
        },
        platformSpecific: {
            hourlyRate: 75, // integer
            deposit: 0,
            firstSessionFree: true, // boolean
        },
        posts: [
            {
                date: new firebase.firestore.Timestamp.now(),
                message: "Hello world!"
            }
        ],
        socialMedia: {
            facebook: "facebook.com/trainermike",
            instagram: "instagram.com/trainermike",
            website: "https://trainermike.com"
        },
        bookingMsg: "Let's get physical!"
    },
];
// ### Delete me! ###

const getCollection = async ({
    collectionName,
    sort,
    limit,
    filters = null,
    startAfter = null
}) => {
    let query = db.collection(collectionName);
    query = query.orderBy(sort.by, sort.order);
    if (startAfter) {
        query = query.startAfter(startAfter);
    }
    query = query.limit(limit);

    filters && filters.forEach((filter) => {
        if (filter) {
            query = query.where(filter.field, filter.operator, filter.value);
        }
    });

    let collection = await query.get();
    return collection.docs.map(doc => {
        return {
            doc: doc,
            id: doc.id,
            data: doc.data()
        };
    });
}

// ### For testing ###
const sorterTest = {
    by: "name.first",
    order: "desc"
}
const sorterTest2 = {
    by: "name.first",
    order: "asc"
};
const filtersTest = [
    {
        field: "name.first",
        operator: ">=",
        value: "Fabio"
    },
    {
        field: "name.first",
        operator: "<=",
        value: "Fabio"
    }
];
const filtersTest2 = [
    {
        field: "email",
        operator: "==",
        value: "email@example.com"
    },
    {
        field: "age",
        operator: "==",
        value: 87
    }
];

// const test1 = await getCollection(
//     {collectionName: "trainer", sort: sorterTest, limit: 5}
// );
// const test2 = await getCollection(
//     {collectionName: "trainer", sort: sorterTest2, limit: 5}
// ); // test if sortBy works
// const test3 = await getCollection(
//     {collectionName: "trainer", sort: sorterTest, limit: 1}
// ); // test if limit works
// const test4 = await getCollection(
//     {collectionName: "trainer", sort: sorterTest, limit: 1, startAfter: test3[0].doc}
// ); // test if pagination works
// const test5 = await getCollection(
//     {collectionName: "trainer", sort: sorterTest, limit: 5, filters: filtersTest}
// ); // test if filter works

// console.log("test1 (sorted by name.first, desc) : ", test1);
// console.log("test2 (should be reverse of test1): ", test2);
// console.log("test3 (should only return 1 doc): ", test3);
// console.log("test4 (should only return doc after test3): ", test4);
// console.log("test 5 (should only return Fabio): ", test5);

// ### Delete me! ###

// Probably only use for testing
const batchWrite = (arrayOfObjects, collectionName) => {
    const trainerRef = db.collection(collectionName);

    arrayOfObjects.forEach((object) => {
        try {
            trainerRef.add(object);
        } catch (error) {
            console.log("write failed!", error);
        } finally {
            console.log("Succesfully added object: ", object);
        }
    });
}