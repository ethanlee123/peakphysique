import { capitalizeWords } from "./capitalizeWords.js";

// Inserts HTML-escaped text into a given selector with a given parentNode
const insertText = (parentNode, selector, text) => {
    const element = parentNode.querySelector(selector);
    element.appendChild(document.createTextNode(text));
}

// Parses a trainer's availability into a string
const getAvailabilityText = (availability) => {
    const dayShorthand = {
        monday: "Mon",
        tuesday: "Tue",
        wednesday: "Wed",
        thursday: "Thu",
        friday: "Fri",
        saturday: "Sat",
        sunday: "Sun"
    };
    const days = {
        weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        weekends: ["Sat", "Sun"]
    };

    let availableDays = [];
    // Loop through the non-empty days in availability...
    // and push its corresponding shorthand form (e.g. "Mon" for "Monday")
    // Into the availableDays array
    for (const day in availability) {
        availability[day].length > 0 && availableDays.push(dayShorthand[day]);
    }

    // Custom text if the available days can be grouped into a certain category
    let text =  availableDays.length === 0 ? "Currently not available" : // If there are no available days
                availableDays.length === 7 ? "Everyday" : // If all days are available
                days.weekdays.every(day => availableDays.includes(day)) ? "Weekdays" : // If available on all weekdays
                days.weekends.every(day => availableDays.includes(day)) ? "Weekends" : // If available on all weekend days
                ""; // Return empty string if none of the above applies

    // If the text variable is not an empty string...
    if (text) {
        // If the trainer is available everyday or not at all...
        if (availableDays.length === 0 || availableDays.length === 7) {
            return text; // There is no more need to further parse availability
        }
        // Else, remove all the days that were included in the text variable
        // E.g. if the text contains "weekends", remove "Sat" and "Sun" from availableDays
        availableDays = availableDays.filter(day => !days[text.toLowerCase()].includes(day));
    }

    // Sort the remaining days in availableDays according to the format:
    // "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
    let sortOrder = ["Weekdays", "Weekends"];
    sortOrder = sortOrder.concat(days.weekdays, days.weekends);
    availableDays = availableDays.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));

    // Add the remaining days in availableDays into the text variable
    for (let i = 0; i < availableDays.length; i++) {
        text += i === 0 && !text ? availableDays[i] : `, ${availableDays[i]}`;
    }

    return `Available ${text}`;
}

// Condenses a trainer's expertise and returns a string with ...
// the first two expertise items and if applicable ...
// the total number of additional expertise items associated with the trainer
const getExpertiseHTML = (expertiseArr) => {
    let text = "";

    if (expertiseArr.length === 0) {
        text = "No expertise listed.";
    } else {
        for (let i = 0; i < 2 && i < expertiseArr.length; i++) {
            text += i === 0 ? capitalizeWords(expertiseArr[i]) : `, ${capitalizeWords(expertiseArr[i])}`;
        }

        text += expertiseArr.length > 2 ? ` <button class="text-toggle">and ${expertiseArr.length - 2} more.</button>` : "";
    }

    return text;
}

export { insertText, getAvailabilityText, getExpertiseHTML };