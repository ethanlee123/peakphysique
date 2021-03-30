const insertText = (parentNode, selector, text) => {
    const element = parentNode.querySelector(selector);
    element.appendChild(document.createTextNode(text));
}

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
    for (const day in availability) {
        availability[day].length > 0 && availableDays.push(dayShorthand[day]);
    }

    let text =  availableDays.length === 0 ? "Currently not available" :
                availableDays.length === 7 ? "Everyday" :
                days.weekdays.every(day => availableDays.includes(day)) ? "Weekdays" :
                days.weekends.every(day => availableDays.includes(day)) ? "Weekends" :
                "";

    if (text) {
        if (availableDays.length === 0 || availableDays.length === 7) {
            return text;
        }
        availableDays = availableDays.filter(day => !days[text.toLowerCase()].includes(day));
    }

    for (let i = 0; i < availableDays.length; i++) {
        text += i === 0 && !text ? availableDays[i] : `, ${availableDays[i]}`;
    }

    return `Available ${text}`;
}

const getExpertiseText = (expertiseArr) => {
    let text = "";

    if (expertiseArr.length === 0) {
        text = "No expertise listed.";
    } else {
        for (let i = 0; i <= 1 && i < expertiseArr.length; i++) {
            text += i === 0 ? expertiseArr[i] : `, ${expertiseArr[i]}`;
        }

        text += expertiseArr.length > 3 ? ` and ${expertiseArr.length} more.` : "";
    }

    return text;
}

export { insertText, getAvailabilityText, getExpertiseText };