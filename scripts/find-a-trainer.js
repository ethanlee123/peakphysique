// ### Variables ###
const bannerImg = document.getElementById("bannerImg");
const banner = document.getElementById("banner");
const filterToggles = document.querySelectorAll("button.toggle-filter");
const setFilterBtn = document.getElementById("setFilterBtn");

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
    bannerImg.style.height = `${(banner.offsetHeight)}px`;
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

filterToggles.forEach((filterToggle) => {
    filterToggle.addEventListener("click", () => {
        if (filterToggle.classList.contains("active")) {
            filterToggle.classList.remove("active");
        } else {
            filterToggle.classList.add("active");
        }
    })
});

// #######################



