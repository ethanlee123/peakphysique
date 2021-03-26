export const generateUnavailableSlots = ({availability, numDays = 28, startDate = new Date(Date.now())}) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const offset = startDate.getDay();
    let currentDate = startDate;
    let unavailability = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    };
    let unavailableSlots = [];

    days.forEach(day => {
        const unavailableTimes = ["morning", "afternoon", "evening"];
        availability[day].forEach(time => {
            const index = unavailableTimes.indexOf(time);
            unavailableTimes.splice(index, 1);
        });
        
        unavailability[`${day}`] = unavailableTimes;
    });

    for (let i = offset; i < (numDays + offset); i++) {
        const index = i < 7 ? i : i % 7;
        const date = i === offset ? startDate : currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = new Intl.DateTimeFormat("en-us").format(date);

        unavailability[days[index]].forEach((time) => {
            unavailableSlots.push({
                date: formattedDate,
                time: time
            });
        });
    }
    
    return unavailableSlots;
};

const availabilityTest = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: []
};

const availabilityTest2 = {
    sunday: ["morning"],
    monday: ["afternoon"],
    tuesday: ["evening"],
    wednesday: ["morning", "afternoon"],
    thursday: ["morning", "evening"],
    friday: ["afternoon", "evening"],
    saturday: ["morning", "afternoon", "evening"]
};

const availabilityTest3 = {
    monday: ["afternoon"],
    sunday: ["morning"],
    wednesday: ["morning", "afternoon"],
    tuesday: ["evening"],
    friday: ["afternoon", "evening"],
    saturday: ["morning", "afternoon", "evening"],
    thursday: ["morning", "evening"],
};

const availabilityTest4 = {
    sunday: [],
    monday: ["morning", "evening"],
    tuesday: [],
    wednesday: ["afternoon"],
    thursday: [],
    friday: ["morning", "evening"],
    saturday: []
};

// const test1 = generateUnavailableSlots({availability: availabilityTest});
// const test2 = generateUnavailableSlots({availability: availabilityTest2});
// const test3 = generateUnavailableSlots({availability: availabilityTest3});
// const test4 = generateUnavailableSlots({availability: availabilityTest4});
// const test5 = generateUnavailableSlots({availability: availabilityTest2, numDays: 7});
// const test6 = generateUnavailableSlots({availability: availabilityTest2, numDays: 7, startDate: new Date("Mar 26 2021")});

// console.log("test1", test1);
// console.log("test2", test2);
// console.log("test3", test3);
// console.log("test4", test4);
// console.log("test5", test5);
// console.log("test6", test6);