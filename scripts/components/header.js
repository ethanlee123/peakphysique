var isLoggedIn = false;

const burgerMenu = document.getElementById("#burgerMenu");
burgerMenu.addEventListener("click", () => {
    document.body.classList.contains("active-nav") ? document.body.classList.remove("active-nav") : document.body.classList.add("active-nav");
});

window.addEventListener("resize", () => {
    getComputedStyle(burgerMenu).display === "none" && document.body.classList.remove("active-nav");
});

