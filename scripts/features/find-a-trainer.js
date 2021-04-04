import { getCollection } from "../api/firebase-queries.js";

import { fitnessOptions, wellnessOptions, availabilityDays } from "../schema.js";

import { debounce } from "../util/debounce.js";
import { getTemplate } from "../util/getTemplate.js";
import { insertText, getExpertiseText, getAvailabilityText } from "../util/getTrainerText.js";
import { getUserAvatar } from "../util/getUserAvatar.js";
import { getGeoPointDistance } from "../util/getGeoPointDistance.js";
import { capitalizeWords } from "../util/capitalizeWords.js";

// ### Variables ###
// ###### Constants ######
const pathToTrainerCard = "../../common/trainer-card.html";
const debounceTime = 250;
const pageSize = 6;

// ###### DOM Variables ######
const bannerImg = document.getElementById("bannerImg");
const banner = document.getElementById("banner");
const toggleBar = document.getElementById("toggleBar");
const filterToggles = document.querySelectorAll("button.toggle-filter");
const filterDrawerToggles = document.querySelectorAll(".toggle-filter-drawer");
const exitDrawerToggle = document.getElementById("exitDrawer");
const filterDrawer = document.getElementById("filterDrawer");
const setFilterBtn = document.getElementById("setFilterBtn");
const resetFilters = document.querySelectorAll(".reset-filters");
const searchBar = document.getElementById("search");
const sortBy = document.getElementById("sortBy");
const sortOrder = document.getElementById("sortOrder");
const trainerList = document.getElementById("trainerList");
const trainerCardTemplate = await getTemplate(pathToTrainerCard);
const pagination = document.getElementById("pagination");
const paginationBtns = document.querySelectorAll("button.paginate");
const pageNums = document.getElementById("pageNums");
const resultsMeta = document.getElementById("resultsMeta");
const resultsFound = document.getElementById("resultsFound");
const applyFilters = document.getElementById("applyFilters");
const ratePerSession = document.getElementById("ratePerSession");
const yearsOfExperience = document.getElementById("yearsOfExperience");
const distanceFromUser = document.getElementById("distanceFromUser");
const geolocationErrorText = document.getElementById("geolocationErrorText");
const firstSessionFree = document.getElementById("firstSessionFree");
const genderFilter = document.getElementsByName("gender");
const noResults = document.getElementById("noResults");
const loader = document.getElementById("loader");

var userLocation;

var trainerListLoader = {
    set isLoading(loading) {
        if (loading) {
            loader.style.display = "block";
            resultsMeta.style.display = "none";
            trainerList.style.display = "none";
        } else {
            loader.style.display = "none";
            resultsMeta.style.display = "flex";
            trainerList.style.display = "grid";
        }
    }
};

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
        if (trainers.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
            this._toDisplay = sort.sortList(trainers, sort.order);
        }
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

    get experience() {
        return this._experience;
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
    
            insertText(trainerCard, ".trainer-name", capitalizeWords(trainer.name));
            insertText(trainerCard, ".rating", trainer.rating ? trainer.rating?.toFixed(1) : "Not Yet Rated");
            insertText(trainerCard, ".rate .text", trainer.hourlyRate ? `${trainer.hourlyRate} / hr` : "Not Listed");
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
        const sortedList = sort.sortList(this._all, prop).filter(trainer => trainer[prop]);
        if (sortedList) {
            return {min: sortedList[0][prop], max: sortedList[sortedList.length - 1][prop]};
        }
    },

    getGeolocationPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        })
    },

    async getGeolocation(errorText) {
        const result = await this.getGeolocationPosition()
            .then(response => {
                const { coords: {latitude, longitude} } = response;
                return {
                    longitude: longitude,
                    latitude: latitude
                };
            })
            .catch(e => {
                let error;
                switch (e.code) {
                    case 1:
                        error = "Please allow geolocation permission to use this filter.";
                        break;
                    case 2:
                        error = "An internal error occurred";
                        break;
                    case 3:
                        error = ""
                        break;
                }
                errorText.innerHTML = error;
            });
        if (result) {
            userLocation = result;
            errorText.innerHTML = "";
            return result;
        }
    },
    
    renderFilterSliders () {
        noUiSlider.create(ratePerSession, {
            start: [this._rate.min, this._rate.max],
            step: 1,
            range: {
                "min": this._rate.min,
                "max": this._rate.max
            },
            connect: true,
            tooltips: true,
            format: {
                to: (value) => {
                    return `$${Math.round(value)}`;
                },
                from: (value) => {
                    return Number(value.replace("$", ""));
                }
            }
        });

        noUiSlider.create(yearsOfExperience, {
            start: [this._experience.min, this._experience.max],
            step: 1,
            range: {
                "min": this._experience.min,
                "max": this._experience.max
            },
            connect: true,
            tooltips: true,
            format: {
                to: (value) => {
                    return `${Math.round(value)} years`;
                },
                from: (value) => {
                    return Number(value.replace(" years", ""));
                }
            }
        });

        noUiSlider.create(distanceFromUser, {
            start: [60],
            step: 10,
            range: {
                "min": 10,
                "max": 60
            },
            connect: true,
            tooltips: true,
            format: {
                to: (value) => {
                    if (value === 60) {
                        return "Any";
                    } else {
                        return `< ${value}km`;
                    }
                },
                from: (value) => {
                    if (value === "Any") {
                        return 60;
                    } else {
                        return Number(value.replace("< |km", ""));
                    }
                }
            }
        });

        distanceFromUser.noUiSlider.on("start", () => {
            if (userLocation) {
                return;
            }
            distanceFromUser.setAttribute("disabled", true);
            this.getGeolocation(geolocationErrorText).then(() => {
                if (userLocation) {
                    distanceFromUser.removeAttribute("disabled"); 
                }              
            });
        });
        
    },

    hideNoResults() {
        noResults.style.display = "none";
    },

    showNoResults() {
        noResults.style.display = "block";
    }
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
        } else {
            this.resetFilters();
            trainers.display = trainers.all;
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

    applyFilters(cardList) {
        let filteredList = cardList;

        for (const filter in this._value) {
            if (filter === "name") {
                filteredList = filteredList.filter(trainer =>  
                    trainer[filter].toLowerCase().includes(this._value[filter].toLowerCase()));
            }

            if (filter === "gender" || filter === "firstSessionFree") {
                filteredList = filteredList.filter(trainer =>  
                    trainer[filter] === this._value[filter]);
            }

            if (filter === "hourlyRate" || filter === "yearsOfExperience") {
                filteredList = filteredList.filter(trainer => 
                    trainer[filter] >= this._value[filter].min &&
                    trainer[filter] <= this._value[filter].max);
            }

            if (filter === "wellness" || filter === "fitness") {
                filteredList = filteredList.filter(trainer =>
                    trainer[filter].some(option => this._value[filter].includes(option.toLowerCase()))
                );
            }

            if (filter === "availability") {
                filteredList = filteredList.filter(trainer => 
                    this._value[filter].some(option => trainer[filter][option].length !== 0)
                );
            }

            if (filter === "location" && userLocation) {
                filteredList = filteredList.filter(trainer => {
                    const trainerCoords = {
                        latitude: trainer[filter].latitude,
                        longitude: trainer[filter].longitude
                    };
                    return getGeoPointDistance(trainerCoords, userLocation) < this._value[filter];
                });
            }
        }

        return filteredList;
    },

    resetFilters() {
        searchBar.value = "";
        fitnessOptionsFilter.selectAll();
        wellnessOptionsFilter.selectAll();
        availabilityFilter.selectAll();
        genderFilter[0].checked = true;
        firstSessionFree.checked = false;
        ratePerSession.noUiSlider.reset();
        yearsOfExperience.noUiSlider.reset();
        distanceFromUser.noUiSlider.reset();
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
        pageNum.classList.add("page-num");
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

        prevBtn.style.display = Number(this._currentPage) === 0 ? "none" : "block";
        nextBtn.style.display = Number(this._currentPage) === (this._totalPages - 1) ? "none" : "block";
    },

    renderResultsFound() {
        if (trainers.display.length === 0) {
            resultsFound.innerHTML = "";
        } else {
            const isFirstPage = Number(this._currentPage) === 0;
            const isLastPage = Number(this._currentPage) === this._totalPages - 1;
            const trainersShown = !isFirstPage && isLastPage ? (trainers.display.length % pageSize !== 0 ? trainers.display.length % pageSize : pageSize ) :
                                    isFirstPage && isLastPage ? trainers.display.length :
                                    pageSize;
            resultsFound.innerHTML = `Showing ${trainersShown} out of <b>${trainers.display.length} trainers</b> found.`;            
        }
    },
    
    styleCurrentPageNum() {
        const previousPageNum = pagination.querySelector(".current-page");
        previousPageNum?.classList.remove("current-page");
        
        const currentPageNum = pagination.querySelector(`[data-page="${this._currentPage}"]`);
        currentPageNum?.classList.add("current-page");
    },
};
// ##################

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
    const excludedFilters = document.querySelectorAll(".toggle-filter:not(.active)");
    if (excludedFilters) {
        excludedFilters.forEach((filter) => {
            filter.dataset.field === "fitness" ?
                fitnessOptionsFilter.deselectOption(filter.dataset.filter) :
                wellnessOptionsFilter.deselectOption(filter.dataset.filter);
        });            
    }

    const includedFilters = document.querySelectorAll(".toggle-filter.active");
    if (includedFilters) {
        includedFilters.forEach((filter) => {
            filter.dataset.field === "fitness" ?
                fitnessOptionsFilter.selectOption(filter.dataset.filter) :
                wellnessOptionsFilter.selectOption(filter.dataset.filter);
        });
    }

    let filtersToApply = filters.values;

    const selectedFitnessOptions = fitnessOptions.flatMap((option) =>
        fitnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedFitnessOptions.length !== fitnessOptions.length) {
        filtersToApply.fitness = selectedFitnessOptions;
    } else {
        delete filtersToApply.fitness;
    }

    const selectedWellnessOptions = wellnessOptions.flatMap((option) =>
        wellnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedWellnessOptions.length !== wellnessOptions.length) {
        filtersToApply.wellness = selectedWellnessOptions;
    } else {
        delete filtersToApply.wellness;
    }

    filters.values = filtersToApply;
}

const deactivateFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        toggle.classList.contains("active") && toggle.classList.remove("active");
    })
}

const resetFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        !toggle.classList.contains("active") && toggle.classList.add("active");
    })
}

const syncFilterToggles = ({fitnessArr, wellnessArr}) => {
    deactivateFilterToggles();

    let activeFilters = [];

    fitnessArr && fitnessArr.forEach(option => {
        const matchingToggle = toggleBar.querySelector(`[data-filter="${option}"]`);
        matchingToggle && activeFilters.push(matchingToggle);
    });

    wellnessArr && wellnessArr.forEach(option => {
        const matchingToggle = toggleBar.querySelector(`[data-filter="${option}"]`);
        matchingToggle && activeFilters.push(matchingToggle);
    });

    activeFilters.forEach(node => node.classList.add("active"));
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
    if (query !== filters?.values?.name &&
            (filters?.values?.name || query)) {
        let newFilters = filters.values;
        newFilters["name"] = query;
        !query && delete newFilters.name;
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

applyFilters.addEventListener("click", debounce(() => {
    const filtersToApply = {};

    const selectedFitnessOptions = fitnessOptions.flatMap((option) =>
        fitnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedFitnessOptions.length !== fitnessOptions.length) {
        filtersToApply.fitness = selectedFitnessOptions;
    }

    const selectedWellnessOptions = wellnessOptions.flatMap((option) =>
        wellnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedWellnessOptions.length !== wellnessOptions.length) {
        filtersToApply.wellness = selectedWellnessOptions;
    }

    const selectedAvailabilityOptions = availabilityDays.flatMap((option) =>
        availabilityFilter.isOptionSelected(option) ? option : []);
    if (selectedAvailabilityOptions.length !== availabilityDays.length) {
        filtersToApply.availability = selectedAvailabilityOptions;
    }

    if (firstSessionFree.checked) {
        filtersToApply.firstSessionFree = firstSessionFree.checked;
    }

    genderFilter.forEach(filter => {
        if (filter.checked && filter.value !== "any") {
            filtersToApply.gender = filter.value;
        }
    })

    const rateValues = ratePerSession.noUiSlider.get().map(value => {
        return Number(value.replace("$", ""));
    });
    if (rateValues[0] !== trainers.rate.min || rateValues[1] !== trainers.rate.max) {
        filtersToApply.hourlyRate = {min: rateValues[0], max: rateValues[1]};     
    }

    const experienceValues = yearsOfExperience.noUiSlider.get().map(value => {
        return Number(value.replace(" years", ""));
    });
    if (experienceValues[0] !== trainers.experience.min || experienceValues[1] !== trainers.experience.max) {
        filtersToApply.yearsOfExperience = {min: experienceValues[0], max: experienceValues[1]};        
    }

    const distanceFromUserValue = Number(distanceFromUser.noUiSlider.get().replace("< ", "").replace("km", ""));
    if (distanceFromUserValue) {
        filtersToApply.location = distanceFromUserValue;
    }

    if (filters.name) {
        filtersToApply.name = filters.name;
    }

    if (filters.wellnessExclude) {
        filtersToApply.wellnessExclude = filters.wellnessExclude;
    }

    if (filters.fitnessExclude) {
        filtersToApply.fitnessExclude = filters.fitnessExclude;
    }

    filters.values = filtersToApply;

    syncFilterToggles({
        fitnessArr: selectedFitnessOptions,
        wellnessArr: selectedWellnessOptions
    });
}, debounceTime));

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
    btn.addEventListener("click", debounce(
        () => btn.classList.contains("next") ? page.current++ : page.current--,
        debounceTime));
});

window.addEventListener("resize", () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();

});
// #######################

const initialRender = async () => {
    positionBannerImgHorizontally();
    resizeBannerImgHeight();
    trainerListLoader.isLoading = true;    
    trainers.all = await getCollection({
        collectionName: "trainerOnly",
        sort: {
            by: sort.field,
            order: sort.order === "descending" ? "desc" : "asc"
        }
    });
    trainerListLoader.isLoading = false;
}
initialRender();