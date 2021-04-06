import {
    trainerOnly,
    fitnessOptions,
    wellnessOptions,
    availabilityDays,
    availabilityTimes
} from "../schema.js";
import { massWriteDocuments, getCollection } from "../api/firebase-queries.js";
import { getCity } from "../api/here-api.js";

const genders = [
    "male",
    "female"
];

const photos = {
    female: [
        null,
        null,
        null,
        "https://i.pinimg.com/originals/73/27/e6/7327e6890a52a0e721ed5f92683028af.jpg",
        "https://iv1.lisimg.com/image/22473298/720full-elizabeth-olsen.jpg",
        "https://i1.wp.com/jointheepic.com/wp-content/uploads/2019/04/MelissaMarie-personaltrainer.jpg?resize=500%2C500&ssl=1",
        "https://i.pinimg.com/originals/b6/a6/1d/b6a61db705b07ed609acd3df85f0ecc7.jpg",
        "https://img.srgcdn.com/e//cUFZNmp1SWdsaHpTbGtoeWN4Y24uanBn.jpg",
        "https://mk0precisionathmejxw.kinstacdn.com/wp-content/uploads/2020/01/PRECISIONPORTRAITS-JPhoto-7-scaled.jpg",
        "https://secure.i.telegraph.co.uk/multimedia/archive/02859/BjMw_uuIIAA6Qp2_2859133c.jpg",
        "https://miro.medium.com/max/2142/1*BxNk8KGquVojeJTqbu_uzg.jpeg",
        "https://live.staticflickr.com/5691/30473508070_513ef907d9_b.jpg",
        "https://i.pinimg.com/236x/ca/f0/ae/caf0ae6da78dc840936cd3125f22c730.jpg",
        "http://i.imgur.com/L5p8A4a.jpg",
        "https://i.redd.it/pqfa5c3cm7sy.jpg"
    ],
    male: [
        null,
        null,
        null,
        "https://annotatedgilmoregirls.files.wordpress.com/2018/04/8b5045ecf619d9ea16496dedcc1133ce.jpg",
        "https://www.si.com/.image/t_share/MTY4MTI1OTIwMzUxNTYwOTc3/fabio-1990s-inlinejpg.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/5/5f/Isaiah_Mustafa_%284999425867%29%2C_crop.jpg",
        "https://pbs.twimg.com/media/C8WZT_IVwAA2qt7.jpg",
        "https://i.kym-cdn.com/photos/images/newsfeed/000/110/672/1301700505625.jpg",
        "https://media.npr.org/assets/img/2012/09/14/headshot---cropped_vert-b425b9d3553d0de2a586b5fb27743ab809088051.jpg",
        "https://mirrorimages.co/wp-content/uploads/2017/10/Mike-Tyson-Head-Shoot.jpg",
        "https://images6.fanpop.com/image/photos/43400000/Chris-Evans-interview-Variety-s-Actors-on-Actors-at-home-chris-evans-43454895-1080-1337.jpg",
        "https://i.pinimg.com/originals/e4/0e/c6/e40ec689ff43d1500f3969cef60a3e83.jpg",
        "https://i.pinimg.com/originals/1f/7b/6c/1f7b6cbdbe6424b28cb315f665be731d.jpg",
        "https://64.media.tumblr.com/6d2379532129749a32d84fec4280faeb/tumblr_nykh3m9SHn1sh6br8o2_1280.jpg",
        "https://i.pinimg.com/236x/7b/ff/7f/7bff7f37e66bd536d7405cfd283e7ff1.jpg"
    ]
}

const firstNames = {
    female: [
        "Kristin",
        "Karen",
        "Lisa",
        "Lucy",
        "Melissa",
        "Mandy",
        "Nora",
        "Olivia",
        "Petra",
        "Quincey",
        "Riley",
        "Samantha",
        "Tiffany",
        "Ursula",
        "Victoria",
        "Vanessa",
        "Whitney",
        "Yennefer",
        "Zoey"
    ],
    male: [
        "Kevin",
        "Lucas",
        "Mark",
        "Marcus",
        "Nigel",
        "Oscar",
        "Peter",
        "Quentin",
        "Rhodes",
        "Steven",
        "Stephen",
        "Tim",
        "Timothy",
        "Uldred",
        "Vincent",
        "Victoria",
        "Wesley",
        "Xander",
        "Zac"
    ]
};

const lastNames = [
    "Jones",
    "Smith",
    "Garcia",
    "Edwards",
    "Brown",
    "Thompson",
    "Sullivan",
    "Rodriguez",
    "Williams",
    "Johnson",
    "Martinez",
    "Gregory",
    "Wilson",
    "Burke",
    "Hayden",
    "Lopez",
    "Wilkins",
    "Mullin",
    "Lee",
    "Campbell",
    "King",
    "White",
    "Perez",
    "Wang",
    "Park"
];

const about = [
    "I like helping people!",
    "",
    "What does the fox say?",
    "You're my own personal brand of heroin"
];

const phoneNumber = [
    "604 254 8415",
    "778 9841 5413",
    ""
];

const website = [
    "example.com",
    ""
];

const favWorkout = [
    "Squats",
    "Push-ups",
    "Bench Press",
    "Curls",
    ""
];

const favCheatMeal = [
    "Pizza",
    "Apple pie",
    "",
    "Popeye's",
    "Fried chicken",
    "Oreos",
    "Iced Coffee"
];

const randomFact = [
    "My favourite colour is green",
    "I'm friends with Joe Exotic",
    "",
    "I'm taller than 99% of the population"
];

const fitnessLevel = [
    "beginner",
    "intermediate",
    "expert",
    "master",
    "god-like",
    "fabio"
];

const fitnessGoals = [
    "lose weight",
    "get a six pack",
    ""
];

const getRandomRange = (max, min = 0, int = true) => {
    const value = Math.random() * (max - min + 1) + min;
    if (int) {
        return Math.floor(value);
    }
    return value;
}

const getRandomValue = (arr) => {
    return arr[getRandomRange(arr.length - 1)];
}

const getRandomExpertise = (arr, num) => {
    let expertise = [];
    for (let i = 0; i < num; i++) {
        do {
            const randomNum = getRandomRange(arr.length - 1);
            const value = arr[randomNum];
            if (!expertise.includes(value)) {
                expertise.push(value);
            }
        } while (expertise.length < i + 1)
    }
    return expertise;
}

const getRandomAvailability = (num) => {
    let availability = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    };
    let daysToSet = [];

    do {
        const randomDay = getRandomValue(availabilityDays);
        if (!daysToSet.includes(randomDay)) {
            daysToSet.push(randomDay);
        }
    } while (daysToSet.length < num + 1)

    daysToSet.forEach(day => {
        let times = [];
        const timesAvailable = getRandomRange(3, 1);
        do {
            const randomTime = getRandomValue(availabilityTimes);
            if (!availability[day].includes(randomTime)) {
                availability[day].push(randomTime);
            }
        } while (availability[day].length < timesAvailable)
    })

    return availability;
}

const generateTrainers = (numToGenerate) => {
    let trainers = [];
    for (let i = 0; i < numToGenerate; i++) {
        const trainer = {...trainerOnly};
        trainer.gender = getRandomValue(genders);
        trainer.firstName = getRandomValue(firstNames[trainer.gender]);
        trainer.lastName = getRandomValue(lastNames);
        trainer.name = `${trainer.firstName} ${trainer.lastName}`;
        trainer.userId = `${trainer.firstName.toLowerCase()}-${trainer.lastName.toLowerCase()}-${i}-${getRandomRange(100)}`;
        trainer.profilePic = getRandomValue(photos[trainer.gender]);
        trainer.yearsOfExperience = getRandomRange(1, 30);
        trainer.hourlyRate = getRandomRange(11, 300);
        trainer.firstSessionFree = getRandomRange(2) === 0 ? true : false;
        trainer.rating = getRandomRange(4, 1, false);
        
        const lat = getRandomRange(-90, 90, false);
        const lon = getRandomRange(-180, 180, false);
        trainer.location = new firebase.firestore.GeoPoint(lat, lon);

        trainer.fitness = getRandomExpertise(fitnessOptions, getRandomRange(3));
        trainer.wellness = getRandomExpertise(wellnessOptions, getRandomRange(3));

        trainer.availability = getRandomAvailability(getRandomRange(7));
        trainers.push(trainer);
    }
    return trainers;
}

const getGeneratedTrainers = async () => {
    let trainers = await getCollection({collectionName: "trainerOnly"});
    trainers = trainers.filter(trainer =>
        trainer.userId.includes(trainer.firstName.toLowerCase()) &&
        trainer.userId.includes(trainer.lastName.toLowerCase()));
    return trainers;
}

const generateUsersFromTrainers = (trainers) => {
    return trainers.map(trainer => {
        return {
            userId: trainer.userId,
            firstName: trainer.firstName,
            lastName: trainer.lastName,
            name: trainer.name,
            fitnessGoals: getRandomValue(fitnessGoals),
            age: getRandomRange(65, 18),
            email: `${trainer.firstName}${trainer.lastName}@gmail.com`,
            phoneNumber: getRandomValue(phoneNumber),
            gender: trainer.gender,
            location: trainer.location,
            city: "Smallville",
            favCheatMeal: getRandomValue(favCheatMeal),
            favWorkout: getRandomValue(favWorkout),
            fitnessLevel: getRandomValue(fitnessLevel),
            gender: trainer.gender,
            profilePic: trainer.profilePic,
            rating: trainer.rating,
            facebook: getRandomValue(website),
            instagram: getRandomValue(website),
            role: "trainer",
            about: getRandomValue(about),
            randomFact: getRandomValue(randomFact),
            radius: null,      
        }
    });
}
