import { debounce } from "../util/debounce.js";
import { fitnessOptions, wellnessOptions, availabilityDays } from "../schema.js";
import { getTemplate } from "../util/getTemplate.js";

// ### Test Data ###
const trainer1 = {
    userId: "fabio.lous",
    firstName: "Fabio",
    lastName: "Lous",
    name: "Fabio Lous",
    profilePic: "https://vz.cnwimg.com/thumb-1200x/wp-content/uploads/2010/03/Fabio-e1603764807834.jpg",
    website: "fabiolous.com",
    hourlyRate: 23,
    deposit: null,
    firstSessionFree: true,
    yearsOfExperience: 78,
    rating: 4.3,
    fitness: ["Bodybuilding"],
    wellness: ["Custom Workout Regimen"],
    certifications: [],
    availability: {
        monday: ["morning"],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: ["evening"],
        saturday: ["afternoon"],
        sunday: []
    }
};

const trainer2 = {
    userId: "fabio.tiful",
    firstName: "Fabio",
    lastName: "Tiful",
    name: "Fabio Tiful",
    profilePic: "https://vz.cnwimg.com/thumb-1200x/wp-content/uploads/2010/03/Fabio-e1603764807834.jpg",
    website: "fabiotiful.com",
    hourlyRate: 89,
    deposit: null,
    firstSessionFree: true,
    yearsOfExperience: 12,
    rating: 5,
    fitness: ["Bodybuilding", "Yoga", "Dance"],
    wellness: ["Weight Loss", "Custom Workout Regimen"],
    certifications: [],
    availability: {
        monday: ["morning"],
        tuesday: ["morning"],
        wednesday: ["morning"],
        thursday: ["morning"],
        friday: ["evening"],
        saturday: ["afternoon"],
        sunday: []
    }
};

const trainer3 = {
    userId: "fabio.logy",
    firstName: "Fabio",
    lastName: "Logy",
    name: "Fabio Logy",
    profilePic: "https://vz.cnwimg.com/thumb-1200x/wp-content/uploads/2010/03/Fabio-e1603764807834.jpg",
    website: "fabiology.com",
    hourlyRate: 76,
    deposit: null,
    firstSessionFree: false,
    yearsOfExperience: 12,
    rating: 2,
    fitness: ["Bodybuilding", "Yoga", "Dance"],
    wellness: ["Weight Loss", "Custom Workout Regimen"],
    certifications: [],
    availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    }
};

const trainers = [trainer1, trainer2, trainer3, trainer1, trainer3, trainer2];
// #################

// ### Variables ###
const pathToTrainerCard = "../../common/trainer-card.html";
const debounceTime = 250;
const pageSize = 6;

// ###### DOM Variables ######
const bannerImg = document.getElementById("bannerImg");
const banner = document.getElementById("banner");
const filterToggles = document.querySelectorAll("button.toggle-filter");
const filterDrawerToggles = document.querySelectorAll(".toggle-filter-drawer");
const exitDrawerToggle = document.getElementById("exitDrawer");
const filterDrawer = document.getElementById("filterDrawer");
const setFilterBtn = document.getElementById("setFilterBtn");
const resetFilters = document.querySelectorAll(".reset-filters");
const searchBar = document.getElementById("search");
const sortBy = document.getElementById("sortBy");
const sortOrder = document.getElementById("sortOrder");
const rangeSliders = document.querySelectorAll(".range-slider");
const trainerList = document.getElementById("trainerList");
const trainerCardTemplate = await getTemplate(pathToTrainerCard);
const pagination = document.getElementById("pagination");

// const expertiseFilter = document.getElementById("expertiseFilter");
// const ratePerSession = document.getElementById("ratePerSession");
// const yearsOfExperience = document.getElementById("yearsOfExperience");
// const distanceFromUser = document.getElementById("distanceFromUser");
// ###########################

var searchQuery = "";
var sort = {
    field: "name",
    descending: false
}
const filtersDefault = {
    wellness: [],
    wellnessExclude: [],
    fitness: [],
    fitnessExclude: [],
    ratePerSession: {
        min: undefined,
        max: undefined
    },
    firstSessionFree: undefined,
    yearsOfExperience: undefined,
    gender: undefined,
    distance: undefined
};
var filters = {
    value: {},
    
    updateFilterButtons() {
        if (Object.keys(this.value).length !== 0) {
            setFilterBtn.classList.remove("no-filters", "btn-outline-light");
            setFilterBtn.classList.add("btn-primary");
        } else {
            setFilterBtn.classList.remove("btn-primary");
            setFilterBtn.classList.add("no-filters", "btn-outline-light");
        }
    },

    get values() {
        return this.value;
    },

    set values(filters) {
        this.value = filters;
        this.updateFilterButtons();
    }
};
// ##################

const capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, text => {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
}

const createOptions = (stringArr) => {
    return stringArr.map(string => {
        return [capitalizeWords(string), string];
    });
}

const positionBannerImgHorizontally = () => {
    const bannerWidth = banner.offsetWidth;
    const windowWidth = window.innerWidth;
    bannerImg.style.right = `${(bannerWidth - windowWidth) / 2}px`;
}

const resizeBannerImgHeight = () => {
    bannerImg.style.height = `${(banner.offsetHeight * 1.15)}px`;
}

const setFilterToggles = () => {
    let newFilters = filters.values;
    newFilters["wellnessExclude"] = [];
    newFilters["fitnessExclude"] = [];
    
    const excludedFilters = document.querySelectorAll(".toggle-filter:not(.active)");
    if (excludedFilters) {
        excludedFilters.forEach((filter) => {
            const type = `${filter.dataset.field}Exclude`;
            const value = filter.dataset.filter;
            newFilters[type].push(value);
        });            
    }

    newFilters["fitnessExclude"].length === 0 && delete newFilters["fitnessExclude"];
    newFilters["wellnessExclude"].length === 0 && delete newFilters["wellnessExclude"];

    filters.values = newFilters;
}

const resetFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        !toggle.classList.contains("active") && toggle.classList.add("active");
    })
}

const insertText = (parentNode, selector, text) => {
    const element = parentNode.querySelector(selector);
    element.appendChild(document.createTextNode(text));
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
                availableDays.length === 7 ?
                    "Everyday" && availableDays.splice(0, availableDays.length) :
                days.weekdays.every(day => availableDays.includes(day)) ? "Weekdays" :
                days.weekends.every(day => availableDays.includes(day)) ? "Weekends" :
                "";

    if (text) {
        if (availableDays.length === 0) {
            return text;
        }
        availableDays = availableDays.filter(day => !days[text.toLowerCase()].includes(day));
    }

    for (let i = 0; i < availableDays.length; i++) {
        text += i === 0 && !text ? availableDays[i] : `, ${availableDays[i]}`;
    }

    return `Available ${text}`;
}

const renderTrainerCards = (trainers) => {
    trainerList.innerHTML = "";

    trainers.forEach(trainer => {

        const trainerCard = document.importNode(trainerCardTemplate.content, true);
        const expertiseArr = trainer.fitness.concat(trainer.wellness);

        insertText(trainerCard, ".trainer-name", trainer.name);
        insertText(trainerCard, ".rating", trainer.rating.toFixed(1));
        insertText(trainerCard, ".rate .text", `${trainer.hourlyRate} / hr`);
        insertText(trainerCard, ".expertise .text", getExpertiseText(expertiseArr));
        insertText(trainerCard, ".availability .text", getAvailabilityText(trainer.availability));

        if (trainer.firstSessionFree) {
            const badge = document.createElement("span");
            badge.classList.add("badge", "free-trial");
            badge.appendChild(document.createTextNode("Free trial"));

            const hourlyRate = trainerCard.querySelector(".rate .text");
            hourlyRate.appendChild(badge);
        }

        const viewProfile = trainerCard.querySelector(".view-profile");
        viewProfile.addEventListener("click", () => {
            localStorage.setItem("trainerProfileId", trainer.userId);
            window.location.href = "../../user-profile.html";
        });

        trainerList.appendChild(trainerCard);
    });
}
renderTrainerCards(trainers);

// ### jQuery - Range Sliders ###

rangeSliders.forEach(slider => 
    noUiSlider.create(slider, {
        start: [0, 100],
        step: 1,
        range: {
            "min": 0,
            "max": 100
        },
        connect: true,
        tooltips: true
    })
);
// ##############################


// ### jQuery - Dropdown Checkbox ###
const fitnessOptionsFilter = $("#fitnessOptionsFilter").filterMultiSelect({
    items: createOptions(fitnessOptions),
    selectAllText: "Select All"
});
fitnessOptionsFilter.selectAll();

const wellnessOptionsFilter = $("#wellnessOptionsFilter").filterMultiSelect({
    items: createOptions(wellnessOptions),
    selectAllText: "Select All"
});
wellnessOptionsFilter.selectAll();

const availabilityFilter = $("#availabilityFilter").filterMultiSelect({
    items: createOptions(availabilityDays),
    selectAllText: "Select All"
});
availabilityFilter.selectAll();
// ##################################

// ### Event Listeners ###
window.addEventListener("load", () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();    
});

window.addEventListener("resize", () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();
});

filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => toggle.classList.toggle("active"));
    toggle.addEventListener("click", debounce(setFilterToggles, debounceTime));
});

searchBar.addEventListener("keyup", debounce(() => {
    const query = searchBar.value.trim();
    if (query && query !== searchQuery) {
        searchQuery = query;
    }
}, debounceTime));

sortBy.addEventListener("change", (event) => {
    const sortByValue = event.target.value;
    const ascending = sortOrder.querySelector(".asc");
    const descending = sortOrder.querySelector(".desc");

    switch (sortByValue) {
        case "name":
            ascending.innerHTML = "A - Z";
            descending.innerHTML = "Z - A";
            break;
        case "rate":
            ascending.innerHTML = "Lowest - Highest";
            descending.innerHTML = "Highest - Lowest";
            break;
        case "rating":
            ascending.innerHTML = "Lowest - Highest";
            descending.innerHTML = "Highest - Lowest";
            break;
    }

    sort.field = sortByValue;
});

sortOrder.addEventListener("change", () => {
    sort.descending = !sort.descending;
});

resetFilters.forEach((btn) => {
    btn.addEventListener("click", debounce(() => {
        if (Object.keys(filters.values).length !== 0) {
            filters.values = {};
            resetFilterToggles();
        }
    }, debounceTime));
});

filterDrawerToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        if (filterDrawer.classList.contains("active")) {
            filterDrawer.classList.remove("active");
        } else {
            filterDrawer.classList.add("active");
        }
    });
});

exitDrawerToggle.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
});

// #######################

positionBannerImgHorizontally();
resizeBannerImgHeight();