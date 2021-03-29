import { debounce } from "../util/debounce.js";
import { fitnessOptions, wellnessOptions, availabilityDays } from "../schema.js";
import { getTemplate } from "../util/getTemplate.js";
import { insertText, getExpertiseText, getAvailabilityText } from "../util/getTrainerText.js";
import { getUserAvatar } from "../util/getUserAvatar.js";

// ### Test Data ###
const trainer1 = {
    userId: "fabio.lous",
    firstName: "Fabio",
    lastName: "Lous",
    name: "Fabio Lous",
    profilePic: "",
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
const totalTrainers = 13;
const generateFabios = (max, obj1, obj2, obj3) => {
    let randomNum;
    let fabios = [];
    for(let i = 0; i < max; i++) {
        randomNum = Math.floor(Math.random() * Math.floor(3));
        randomNum === 0 ? fabios.push({...obj1}) :
            randomNum === 1 ? fabios.push({...obj2}) :
            fabios.push({...obj3});
        fabios[i].userId = `${fabios[i].userId}-0${i}`;
    }
    return fabios;
}
const trainersData = generateFabios(totalTrainers, trainer1, trainer2, trainer3);
// #################

// ### Variables ###
// ###### Constants ######
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
const paginationBtns = document.querySelectorAll("button.paginate");
const pageNums = document.getElementById("pageNums");
const resultsFound = document.getElementById("resultsFound");
const ratePerSession = document.getElementById("ratePerSession");
const yearsOfExperience = document.getElementById("yearsOfExperience");
const distanceFromUser = document.getElementById("distanceFromUser");

var trainers = {
    _all: [],
    _toDisplay: [],
    _rate: {
        min: 0,
        max: 0
    },
    _experience: {
        min: 0,
        max: 0
    },

    set display(trainers) {
        this._toDisplay = sort.sortList(trainers, sort.order);
        this.renderTrainerCards(this.getPage(trainers, 0, pageSize));
        page.total = Math.ceil(trainers.length / pageSize);
    },

    set all(trainers) {
        this._all = trainers;
        this.display = trainers;
        this._rate = this.getSliderRange("hourlyRate");
        this._experience = this.getSliderRange("yearsOfExperience");
        this.renderFilterSliders();
    },

    get display() {
        return this._toDisplay;
    },

    get all() {
        return this._all;
    },

    get rate() {
        return this._rate;
    },

    paginate(page) {
        this.renderTrainerCards(this.getPage(this._toDisplay, page, pageSize));
    },

    getPage (arr, pageNum, pageSize) {
        const startIndex = pageNum * pageSize;
        const endIndex = startIndex + pageSize;
        const isLastPage = arr.length - (pageSize * pageNum) < pageSize && true;
    
        if (isLastPage) {
            return arr.slice(startIndex);
        }
        return arr.slice(startIndex, endIndex);
    },

    renderTrainerCards (trainers) {
        trainerList.innerHTML = "";
    
        trainers.forEach(trainer => {
    
            const trainerCard = document.importNode(trainerCardTemplate.content, true);
            const expertiseArr = trainer.fitness.concat(trainer.wellness);
    
            insertText(trainerCard, ".trainer-name", trainer.name);
            insertText(trainerCard, ".rating", trainer.rating.toFixed(1));
            insertText(trainerCard, ".rate .text", `${trainer.hourlyRate} / hr`);
            insertText(trainerCard, ".expertise .text", getExpertiseText(expertiseArr));
            insertText(trainerCard, ".availability .text", getAvailabilityText(trainer.availability));
            getUserAvatar({user: trainer, parentNode: trainerCard});
    
            if (trainer.firstSessionFree) {
                const badge = document.createElement("span");
                badge.classList.add("badge", "free-trial");
                badge.appendChild(document.createTextNode("Free trial"));
    
                const hourlyRate = trainerCard.querySelector(".rate .text");
                hourlyRate.appendChild(badge);
            }
    
            const viewProfile = trainerCard.querySelector(".view-profile");
            viewProfile.addEventListener("click", () => {
                localStorage.setItem("trainerProfileToDisplay", JSON.stringify(trainer));
                window.location.href = "../../user-profile.html";
            });
    
            trainerList.appendChild(trainerCard);
        });
    },

    getSliderRange(prop) {
        const sortedList = sort.sortList(this._all, prop);
        if (sortedList) {
            return {min: sortedList[0][prop], max: sortedList[sortedList.length - 1][prop]};
        }
    },
    
    renderFilterSliders () {
        const rateSlider = noUiSlider.create(ratePerSession, {
            start: [this._rate.min, this._rate.max],
            step: 1,
            range: {
                "min": this._rate.min,
                "max": this._rate.max
            },
            connect: true,
            tooltips: true
        });

        const experienceSlider = noUiSlider.create(yearsOfExperience, {
            start: [this._experience.min, this._experience.max],
            step: 1,
            range: {
                "min": this._experience.min,
                "max": this._experience.max
            },
            connect: true,
            tooltips: true
        });

        const distanceSlider = noUiSlider.create(distanceFromUser, {
            start: [60],
            step: 10,
            range: {
                "min": 10,
                "max": 60
            },
            connect: true,
            tooltips: true
        });
        
    },
};

var sort = {
    _by: "name",
    _order: "ascending",

    set values({field, isDescending}) {
        this._by = field;
        this._order = isDescending ? "descending" : "ascending";
        trainers.display = this.sortList(trainers.display, this._by, this._order);
    },

    get field() {
        return this._by;
    },

    get order() {
        return this._order;
    },

    get isDescending() {
        if (this._order === "ascending") {
            return false;
        }
        return true;
    },

    sortList(arr, sortBy, sortOrder = "ascending") {
        let sortedList = arr.map(obj => ({...obj}));
        sortedList = sortedList.sort((a, b) =>
            a[sortBy] > b[sortBy] ? 1 :
            a[sortBy] < b[sortBy] ? -1 : 0);
        if (sortOrder == "descending") {
            sortedList = sortedList.reverse();
        }
        return sortedList;
    }
}

var filters = {
    _value: {},
    get values() {
        return this._value;
    },

    set values(filters) {
        this._value = filters;
        const noFilters = Object.keys(this._value).length === 0 && true;
        this.updateFilterButtons(noFilters);
        if (!noFilters) {
            trainers.display = this.applyFilters(trainers.all);
        }
    },

    updateFilterButtons(noFilters) {
        if (!noFilters) {
            setFilterBtn.classList.remove("no-filters", "btn-outline-light");
            setFilterBtn.classList.add("btn-primary");
        } else {
            setFilterBtn.classList.remove("btn-primary");
            setFilterBtn.classList.add("no-filters", "btn-outline-light");
        }
    },

    default: {
        name: "",
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
    },

    applyFilters(cardList) {
        let filteredList = cardList;

        for (const filter in this._value) {
            if (typeof this._value[filter] === "string") {
                filteredList = filteredList.filter(trainer => 
                    trainer[filter].toLowerCase().includes(this._value[filter].toLowerCase()));
            }

            console.log("filteredList", filteredList);
        }

        return filteredList;
    }
};

var page = {
    _currentPage: 0,
    _totalPages: 0,

    get current() {
        return this._currentPage;
    },

    get total() {
        return this._totalPages;
    },

    set current(current) {
        this._currentPage = current;
        this.renderPaginationBtns();
        this.styleCurrentPageNum();
        this.renderResultsFound();
        trainers.paginate(current);
    },

    set total(total) {
        this._totalPages = total;
        this._currentPage = 0;
        this.renderPagination();
        total > 1 && this.styleCurrentPageNum();
        this.renderResultsFound();
    },

    renderPageNum(num) {
        const pageNum = document.createElement("span");
        pageNum.appendChild(document.createTextNode(num));
        pageNum.setAttribute("data-page", `${num - 1}`);
        return pageNum;
    },

    renderPagination() {
        if (this._totalPages <= 1) {
            pagination.style.display = "none";
        } else {
            pagination.style.display = "flex";
            pageNums.innerHTML = "";
            
            const numsToRender = this._totalPages < 3 ? this._totalPages :
                                    this._totalPages > 3 && this._totalPages <= 5 ? 2 : 3;
            for (let i = 1; i <= numsToRender; i++) {
                pageNums.appendChild(this.renderPageNum(i));
            }
    
            if (numsToRender < this._totalPages) {
                pageNums.appendChild(document.createTextNode("... "));
                pageNums.appendChild(this.renderPageNum(this._totalPages));
            }

            const nums = pageNums.querySelectorAll("span");
            nums.forEach(num => {
                num.addEventListener("click", () => {
                    this.current = num.dataset.page;
                });
            });
        }
    },

    renderPaginationBtns() {
        const prevBtn = pagination.querySelector("#previous");
        const nextBtn = pagination.querySelector("#next");

        prevBtn.style.display = this._currentPage === 0 ? "none" : "block";
        nextBtn.style.display = this._currentPage === (this._totalPages - 1) ? "none" : "block";
    },

    renderResultsFound() {
        if (trainers.display.length === 0) {
            resultsFound.innerHTML = "";
        } else {
            const isFirstPage = this._currentPage === 0;
            const isLastPage = this._currentPage === this._totalPages - 1;
            const trainersShown = !isFirstPage && isLastPage ? (trainers.display.length % pageSize) :
                                    isFirstPage && isLastPage ? trainers.display.length :
                                    pageSize;
            resultsFound.innerHTML = `Showing ${trainersShown} out of <b>${trainers.display.length} trainers</b> found.`;            
        }
    },
    
    styleCurrentPageNum() {
        const previousPageNum = pagination.querySelector(".current-page");
        previousPageNum?.classList?.remove("current-page");
        
        const currentPageNum = pagination.querySelector(`[data-page="${this._currentPage}"]`);
        currentPageNum.classList.add("current-page");
    },
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
filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => toggle.classList.toggle("active"));
    toggle.addEventListener("click", debounce(setFilterToggles, debounceTime));
});

searchBar.addEventListener("keyup", debounce(() => {
    const query = searchBar.value.trim();
    if (query !== filters?.values?.name) {
        let newFilters = filters.values;
        newFilters["name"] = query;
        filters.values = newFilters;
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
        case "hourlyRate":
            ascending.innerHTML = "Lowest - Highest";
            descending.innerHTML = "Highest - Lowest";
            break;
        case "rating":
            ascending.innerHTML = "Lowest - Highest";
            descending.innerHTML = "Highest - Lowest";
            break;
    }

    sort.values = {
        field: sortByValue,
        isDescending: sort.isDescending
    };
});

sortOrder.addEventListener("change", () => {
    sort.values = {
        field: sort.field,
        isDescending: !sort.isDescending
    };
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
        filterDrawer.classList.toggle("active");
    });
});

exitDrawerToggle.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
});

paginationBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.contains("next") ? page.current++ : page.current--;
    });
});

window.addEventListener("resize", () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();

});
// #######################

const initialRender = () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();    
    trainers.all = trainersData;
}
initialRender();