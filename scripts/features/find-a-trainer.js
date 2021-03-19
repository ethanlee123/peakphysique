import { debounce } from "../util/debounce.js";

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
// ###########################

const debounceTime = 250;
let searchQuery = "";
let sort = {
    field: "",
    descending: false
}
const filtersDefault = {
    typeOfService: [],
    typeOfServiceExclude: [],
    expertise: [],
    expertiseExclude: [],
    ratePerSession: {
        min: undefined,
        max: undefined
    },
    firstSessionFree: undefined,
    yearsOfExperience: undefined,
    certifications: [],
    gender: undefined,
    distance: undefined
};
var filters = {
    value: {},
    
    updateFilterButtons() {
        if (Object.keys(this.value).length !== 0) {
            console.log("filters detected...");
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
    newFilters["typeOfServiceExclude"] = [];
    newFilters["expertiseExclude"] = [];
    
    const excludedFilters = document.querySelectorAll(".toggle-filter:not(.active)");
    if (excludedFilters) {
        excludedFilters.forEach((filter) => {
            const type = `${filter.dataset.field}Exclude`;
            const value = filter.dataset.filter;
            newFilters[type].push(value);
        });            
    }

    newFilters["typeOfServiceExclude"].length === 0 && delete newFilters.typeOfServiceExclude;
    newFilters["expertiseExclude"].length === 0 && delete newFilters.expertiseExclude;

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

filterDrawerToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        if (filterDrawer.classList.contains("active")) {
            filterDrawer.classList.remove("active");
        } else {
            filterDrawer.classList.add("active");
        }
    });
});

resetFilters.forEach((btn) => {
    btn.addEventListener("click", debounce(() => {
        if (Object.keys(filters.values).length !== 0) {
            filters.values = {};
            resetFilterToggles();
        }
    }, debounceTime));
})

exitDrawerToggle.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
});

// #######################