import { getCollection } from "../api/firebase-queries.js";

import { fitnessOptions, wellnessOptions, availabilityDays } from "../schema.js";

import { debounce } from "../util/debounce.js";
import { getTemplate } from "../util/getTemplate.js";
import { insertText, getExpertiseHTML, getAvailabilityText } from "../util/getTrainerText.js";
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

// Determines whether to display the spinner element
// or the trainerList/resultsMeta elements
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
            this._toDisplay = trainers;
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
    
    // Gets the subset of trainers to display
    getPage (arr, pageNum, pageSize) {
        const startIndex = pageNum * pageSize;
        const endIndex = startIndex + pageSize;
        const isLastPage = arr.length - (pageSize * pageNum) < pageSize && true;
    
        if (isLastPage) {
            return arr.slice(startIndex);
        }
        return arr.slice(startIndex, endIndex);
    },

    // Determines which text to render in the expertise section...
    // based on whether or not the element has the "collapsed" class
    renderExpertise(arr, parentNode) {
        const selector = ".expertise .text";
        const expertise = parentNode.querySelector(selector);
        expertise.innerHTML = getExpertiseHTML(arr);
        if (arr.length > 2) {
            expertise.addEventListener("click", () => {
                expertise.classList.toggle("collapsed");

                if (expertise.classList.contains("collapsed")) {
                    expertise.innerHTML = getExpertiseHTML(arr);
                } else {
                    let toDisplay = capitalizeWords(arr.join(", "));
                    toDisplay += "<button class='text-toggle'>Show Less</button>"
                    expertise.innerHTML = toDisplay;
                }
            })            
        }
    },

    renderTrainerCards (trainers) {
        trainerList.innerHTML = "";
        
        // Iterate through list of trainers
        trainers.forEach(trainer => {
            // Deep clone the template for the trainerCard
            const trainerCard = document.importNode(trainerCardTemplate.content, true);
            
            // Change the information contained in the card...
            // to reflect the properties of the current trainer
            insertText(trainerCard, ".trainer-name", capitalizeWords(trainer.name));
            insertText(trainerCard, ".location", trainer.address ? trainer.address : "Not Listed")
            insertText(trainerCard, ".rating", trainer.rating ? trainer.rating.toFixed(1) : "N/A");
            insertText(trainerCard, ".rate .text", trainer.hourlyRate ? `${trainer.hourlyRate} / hr` : "Not Listed");
            insertText(trainerCard, ".availability .text", getAvailabilityText(trainer.availability));
            getUserAvatar({user: trainer, parentNode: trainerCard});

            const expertiseArr = trainer.fitness.concat(trainer.wellness);
            this.renderExpertise(expertiseArr, trainerCard);

            // If the trainer has enabled free trial...
            // Add an HTML badge next to the rate per session
            if (trainer.firstSessionFree) {
                const badge = document.createElement("span");
                badge.classList.add("badge", "free-trial");
                badge.appendChild(document.createTextNode("Free trial"));
    
                const hourlyRate = trainerCard.querySelector(".rate .text");
                hourlyRate.appendChild(badge);
            }
    
            const viewProfile = trainerCard.querySelector(".view-profile");
            viewProfile.addEventListener("click", () => {
                // Set a localStorage item so that ...
                // the redirect page knows which profile to load
                localStorage.setItem("trainerProfileToDisplay", JSON.stringify(trainer));
                window.location.href = "../../user-profile.html";
            });
    
            trainerList.appendChild(trainerCard);
        });
    },

    // Gets the min and max ranges of a given property in the list of trainers
    getSliderRange(prop) {
        const sortedList = sort.sortList(this._all, prop).filter(trainer => trainer[prop] && typeof trainer[prop] === "number");
        if (sortedList) {
            return {min: sortedList[0][prop], max: sortedList[sortedList.length - 1][prop]};
        }
    },

    getGeolocationPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        })
    },

    // Uses the HTML Geolocation API to retrieve the user's current GPS coordinates
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
                // Display an error message if unable to get user coordinates
                errorText.innerHTML = error;
            });
        if (result) {
            localStorage.setItem("userLocation", JSON.stringify(result));
            errorText.innerHTML = "";
            return result;
        }
    },
    
    // Instantiates the NoUI Slider plugin
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
            start: 5600,
            range: {
                "min": [10, 10],
                "30%": [100, 100],
                "50%": [1000, 1000],
                "max": 5600
            },
            connect: true,
            tooltips: true,
            format: {
                to: (value) => {
                    if (value === 5600) {
                        return "Any";
                    } else {
                        return `< ${Math.round(value)}km`;
                    }
                },
                from: (value) => {
                    if (value === "Any") {
                        return 5600;
                    } else {
                        return Number(value.replace("< |km", ""));
                    }
                }
            }
        });

        distanceFromUser.noUiSlider.on("start", () => {
            // If there is no userLocation in localStorage...
            if (!getUserLocation()) {
                // Disable the slider
                distanceFromUser.setAttribute("disabled", true);
                // Attempt to get user's location
                this.getGeolocation(geolocationErrorText).then(() => {
                    // If userLocation exists after the attempt...
                    if (getUserLocation()) {
                        // Enable the slider
                        distanceFromUser.removeAttribute("disabled"); 
                    }              
                });
            }
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

    // Update the "Set Filter" button based on...
    // whether or not filters have been applied
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
                    // Allow case-sensitive partial matches on search queries
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
                    // Filter out trainers who have none of the selected expertise filters
                    trainer[filter].some(option => this._value[filter].includes(option.toLowerCase()))
                );
            }

            if (filter === "availability") {
                filteredList = filteredList.filter(trainer => 
                    // Filter out trainers who are not available on ...
                    // at least one of the selected availability days
                    this._value[filter].some(option => trainer[filter][option].length !== 0)
                );
            }

            if (filter === "location" && getUserLocation()) {
                filteredList = filteredList.filter(trainer => {
                    // If the location filter or if it does not have the correct properties...
                    // then this trainer is automatically filtered out
                    if (!trainer[filter] || !trainer[filter].latitude || !trainer[filter].longitude) {
                        return false;
                    }

                    const trainerCoords = {
                        latitude: trainer[filter].latitude,
                        longitude: trainer[filter].longitude
                    };
                    return getGeoPointDistance(trainerCoords, getUserLocation()) < this._value[filter];
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
            
            // If there are less than 3 pages, then render all page numbers ...
            // If the number is between 3 & 5, then render 2 ...
            // Else render 3
            const numsToRender = this._totalPages < 3 ? this._totalPages :
                                    this._totalPages > 3 && this._totalPages <= 5 ? 2 : 3;
            for (let i = 1; i <= numsToRender; i++) {
                pageNums.appendChild(this.renderPageNum(i));
            }
            
            // If there are page numbers we are not rendering
            if (numsToRender < this._totalPages) {
                // Add "..." to denote that they exist
                pageNums.appendChild(document.createTextNode("... "));
                // Render the last page number as well
                pageNums.appendChild(this.renderPageNum(this._totalPages));
            }

            const nums = pageNums.querySelectorAll("span");
            nums.forEach(num => {
                num.addEventListener("click", () => {
                    // Clicking on a page number will
                    // Render the list of trainers in that given page
                    this.current = num.dataset.page;
                });
            });
        }
    },

    renderPaginationBtns() {
        const prevBtn = pagination.querySelector("#previous");
        const nextBtn = pagination.querySelector("#next");

        // Do not show a previous button if on the first page
        prevBtn.style.display = Number(this._currentPage) === 0 ? "none" : "block";
        // Do not show a next button if on the last page
        nextBtn.style.display = Number(this._currentPage) === (this._totalPages - 1) ? "none" : "block";
    },

    renderResultsFound() {
        if (trainers.display.length === 0) {
            resultsMeta.style.display = "none";
        } else {
            resultsMeta.style.display = "flex";
            const isFirstPage = Number(this._currentPage) === 0;
            const isLastPage = Number(this._currentPage) === this._totalPages - 1;
            const trainersShown = !isFirstPage && isLastPage ? (trainers.display.length % pageSize !== 0 ? trainers.display.length % pageSize : pageSize ) :
                                    isFirstPage && isLastPage ? trainers.display.length :
                                    pageSize;
            resultsFound.innerHTML = `Showing ${trainersShown} out of <b>${trainers.display.length} trainers</b> found.`;            
        }
    },

    styleCurrentPageNum() {
        // Remove styling from the previous current page
        const previousPageNum = pagination.querySelector(".current-page");
        previousPageNum?.classList.remove("current-page");
        
        // Apply styling to the new current page
        const currentPageNum = pagination.querySelector(`[data-page="${this._currentPage}"]`);
        currentPageNum?.classList.add("current-page");
    },
};
// ##################

// Returns an array of arrays
// where each sub-array contains the label at index 0,
// and the value at index 1
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

// Syncs the expertise options in the filter drawer...
// whenever the filter toggle states change
const setFilterToggles = () => {    
    const excludedFilters = document.querySelectorAll(".toggle-filter:not(.active)");
    // If there are deselected filter toggles...
    if (excludedFilters) {
        excludedFilters.forEach((filter) => {
            // Deselect the corresponding options in the filter drawer
            filter.dataset.field === "fitness" ?
                fitnessOptionsFilter.deselectOption(filter.dataset.filter) :
                wellnessOptionsFilter.deselectOption(filter.dataset.filter);
        });            
    }

    const includedFilters = document.querySelectorAll(".toggle-filter.active");
    // If there are selected filter toggles...
    if (includedFilters) {
        includedFilters.forEach((filter) => {
            // Select the corresponding options in the filter drawer
            filter.dataset.field === "fitness" ?
                fitnessOptionsFilter.selectOption(filter.dataset.filter) :
                wellnessOptionsFilter.selectOption(filter.dataset.filter);
        });
    }

    // Store the value of the filters variable into a new variable
    let filtersToApply = filters.values;

    // Get the array of selected fitness options
    const selectedFitnessOptions = fitnessOptions.flatMap((option) =>
        fitnessOptionsFilter.isOptionSelected(option) ? option : []);
    // If not everything is selected (i.e., filters have been applied)...
    if (selectedFitnessOptions.length !== fitnessOptions.length) {
        // Store those filters
        filtersToApply.fitness = selectedFitnessOptions;
    } else {
        // Else delete them
        delete filtersToApply.fitness;
    }

    // Get the array of selected fitness options
    const selectedWellnessOptions = wellnessOptions.flatMap((option) =>
        wellnessOptionsFilter.isOptionSelected(option) ? option : []);
    // If not everything is selected (i.e., filters have been applied)...
    if (selectedWellnessOptions.length !== wellnessOptions.length) {
        // Store those filters
        filtersToApply.wellness = selectedWellnessOptions;
    } else {
        // Else delete them
        delete filtersToApply.wellness;
    }

    // Store the new filter values in the filter variable
    filters.values = filtersToApply;
}

// Removes the active class from all filter toggles
const deactivateFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        toggle.classList.contains("active") && toggle.classList.remove("active");
    })
}

// Sets all the filter toggles back into active state
const resetFilterToggles = () => {
    filterToggles.forEach((toggle) => {
        !toggle.classList.contains("active") && toggle.classList.add("active");
    })
}

// Make sure that the filter toggles and...
// the wellness/fitness option filters in the drawer...
// are consistent
const syncFilterToggles = ({fitnessArr, wellnessArr}) => {
    deactivateFilterToggles();

    let activeFilters = [];

    // For each selected option in the fitness options
    fitnessArr && fitnessArr.forEach(option => {
        // Get the matching corresponding toggle for the option
        const matchingToggle = toggleBar.querySelector(`[data-filter="${option}"]`);
        // If the toggle exists, then push into activeFilters
        matchingToggle && activeFilters.push(matchingToggle);
    });

    // For each selected option in the wellness options
    wellnessArr && wellnessArr.forEach(option => {
        // Get the matching corresponding toggle for the option
        const matchingToggle = toggleBar.querySelector(`[data-filter="${option}"]`);
        // If the toggle exists, then push into activeFilters
        matchingToggle && activeFilters.push(matchingToggle);
    });

    // For each matching toggle in activeFilters ...
    // Add the active class
    activeFilters.forEach(node => node.classList.add("active"));
}

const getUserLocation = () => {
    if (localStorage.getItem("userLocation")) {
        return JSON.parse(localStorage.getItem("userLocation"));
    }
    return false;
}

// ### jQuery - Dropdown Checkbox ###
// Instantiates the filter multi-select plugins
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

    // Ensure new query is not the same as stored query
    if (query !== filters?.values?.name &&
            (filters?.values?.name || query)) {
        // Store the current filter values in a new variable
        let newFilters = filters.values;
        // Change the name property of the new variable
        newFilters["name"] = query;
        // If query is empty then remove the filter
        !query && delete newFilters.name;
        // Change the value of the filter variable to trigger...
        // the set function
        filters.values = newFilters;
    }
}, debounceTime));

sortBy.addEventListener("change", (event) => {
    const sortByValue = event.target.value;
    const ascending = sortOrder.querySelector(".asc");
    const descending = sortOrder.querySelector(".desc");
    
    // Change the labels of the sortOrder options...
    // depending on the sortBy value
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

// Fires when the user clicks on...
// the "Set Filters" button in the drawer
applyFilters.addEventListener("click", debounce(() => {
    const filtersToApply = {};

    // If user has excluded any options from ...
    // the default fitness options ...
    // store the values
    const selectedFitnessOptions = fitnessOptions.flatMap((option) =>
        fitnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedFitnessOptions.length !== fitnessOptions.length) {
        filtersToApply.fitness = selectedFitnessOptions;
    }

    // If user has excluded any options from ...
    // the default wellness options ...
    // store the values
    const selectedWellnessOptions = wellnessOptions.flatMap((option) =>
        wellnessOptionsFilter.isOptionSelected(option) ? option : []);
    if (selectedWellnessOptions.length !== wellnessOptions.length) {
        filtersToApply.wellness = selectedWellnessOptions;
    }

    // If user has excluded any options from ...
    // the default availability options ...
    // store the values
    const selectedAvailabilityOptions = availabilityDays.flatMap((option) =>
        availabilityFilter.isOptionSelected(option) ? option : []);
    if (selectedAvailabilityOptions.length !== availabilityDays.length) {
        filtersToApply.availability = selectedAvailabilityOptions;
    }

    // Stores the value if the user has checked the ...
    // first trial free checkbox
    if (firstSessionFree.checked) {
        filtersToApply.firstSessionFree = firstSessionFree.checked;
    }

    // If the value of the gender filter is not "any" ...
    // store the value
    genderFilter.forEach(filter => {
        if (filter.checked && filter.value !== "any") {
            filtersToApply.gender = filter.value;
        }
    })

    // If the value of the rate per session is not [min, max]...
    // store the value
    const rateValues = ratePerSession.noUiSlider.get().map(value => {
        return Number(value.replace("$", "")); // Convert the slider value to number
    });
    if (rateValues[0] !== trainers.rate.min || rateValues[1] !== trainers.rate.max) {
        filtersToApply.hourlyRate = {min: rateValues[0], max: rateValues[1]};     
    }

    // If the value of the years of experience is not [min, max]...
    // store the value
    const experienceValues = yearsOfExperience.noUiSlider.get().map(value => {
        return Number(value.replace(" years", "")); // Convert the slider value to number
    });
    if (experienceValues[0] !== trainers.experience.min || experienceValues[1] !== trainers.experience.max) {
        filtersToApply.yearsOfExperience = {min: experienceValues[0], max: experienceValues[1]};        
    }

    // If the value of the years of experience is a number (default is NaN) ...
    // store the value
    const distanceFromUserValue = Number(distanceFromUser.noUiSlider.get().replace("< ", "").replace("km", ""));
    if (distanceFromUserValue) {
        filtersToApply.location = distanceFromUserValue;
    }

    // If the search bar has an input...
    // store the value
    if (filters.name) {
        filtersToApply.name = filters.name;
    }

    // Store the state of the filter toggles
    if (filters.wellnessExclude) {
        filtersToApply.wellnessExclude = filters.wellnessExclude;
    }

    // Store the state of the filter toggles
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
    // Enable the spinner while we retrieve the trainer list
    trainerListLoader.isLoading = true;    
    trainers.all = await getCollection({
        collectionName: "trainerOnly",
        sort: {
            by: sort.field,
            order: sort.order === "descending" ? "desc" : "asc"
        }
    });
    // Disable the spinner once we have retrieved everything
    trainerListLoader.isLoading = false;
}
initialRender();