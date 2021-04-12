// Generates an array of unavailable timeslots ...
// given an availability object
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

    // Update the unavailability object ...
    // so that it is the "inverse" of the availability param
    days.forEach(day => {
        // Start with the list of possible values
        const unavailableTimes = ["morning", "afternoon", "evening"];

        // Iterate through the the available times for a given day
        availability[day].forEach(time => {
            const index = unavailableTimes.indexOf(time);
            // And remove each available time from the list of possible values
            unavailableTimes.splice(index, 1);
        });
        
        // Push the remaining times onto the corresponding day ...
        // in the unavailability object
        unavailability[`${day}`] = unavailableTimes;
    });

    for (let i = offset; i < (numDays + offset); i++) {
        // If in start of the loop, then store the startDate in the date variable
        // Otherwise, set the currentDate to a day after ...
        // and then store the new currentDate in the date variable
        const date = i === offset ? startDate : currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = new Intl.DateTimeFormat("en-us").format(date);

        // Index of the day of the week based on ...
        // the current date within the loop
        const index = i < 7 ? i : i % 7;

        // Use the index variable to find the current day of the week (days[index]) ...
        // then loop through the corresponding day property within the unavailability prop...
        unavailability[days[index]].forEach((time) => {
            // Store each unavailable time with the formatted date...
            // as a new element in the unavailableSlots array
            unavailableSlots.push({
                date: formattedDate,
                time: time
            });
        });
    }
    
    return unavailableSlots;
};