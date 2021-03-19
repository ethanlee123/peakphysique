import { debounce } from "../util/debounce.js";

// ### Test Data ###
const trainer = {
    name: "",

};
const trainers = [trainer];

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
// #################

// ### Variables ###
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
// ###########################

const debounceTime = 250;
let searchQuery = "";
let sort = {
    field: "name",
    descending: false
}
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

    newFilters["fitnessExclude"].length === 0 && delete newFilters.typeOfServiceExclude;
    newFilters["wellnessExclude"].length === 0 && delete newFilters.expertiseExclude;

    filters.values = newFilters;
}

const resetFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        !toggle.classList.contains("active") && toggle.classList.add("active");
    })
}

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
    toggle.addEventListener("click", () => {
        if (toggle.classList.contains("active")) {
            toggle.classList.remove("active");
        } else {
            toggle.classList.add("active");
        }
    });

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