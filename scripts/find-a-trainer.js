// ### Variables ###
// ###### DOM Variables ######
const bannerImg = document.getElementById("bannerImg");
const banner = document.getElementById("banner");
const filterToggles = document.querySelectorAll("button.toggle-filter");
const filterDrawerToggles = document.querySelectorAll(".toggle-filter-drawer");
const exitDrawerToggle = document.getElementById("exitDrawer");
const filterDrawer = document.getElementById("filterDrawer");
const setFilterBtn = document.getElementById("setFilterBtn");
// ###########################

var filters = {
    value: [],
    
    updateFilterButtons() {
        if (filters) {
            setFilterBtn.classList.remove("no-filters", "btn-outline-light");
            setFilterBtn.classList.add("btn-primary");
        } else {
            setFilterBtn.classList.remove("btn-primary");
            setFilterBtn.classList.add("no-filters", "btn-outline-light");
        }
    },

    get values() {
        return this.value()
    },

    set values(arr) {
        this.value = arr;
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
    })
});

filterDrawerToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        if (filterDrawer.classList.contains("active")) {
            filterDrawer.classList.remove("active");
        } else {
            filterDrawer.classList.add("active");
        }
    })
});

exitDrawerToggle.addEventListener("click", () => {
    filterDrawer.classList.remove("active");
});

// #######################



