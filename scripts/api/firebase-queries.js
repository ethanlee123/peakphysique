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
writeUserProfile();   