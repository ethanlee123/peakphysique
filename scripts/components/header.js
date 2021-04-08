import { logOutUser, getLoggedUser } from "../api/firebase-queries.js";

import { getTemplate } from "../util/getTemplate.js";
import { getUserAvatar } from "../util/getUserAvatar.js";
import { securityGuard } from "../util/securityGuard.js";

const path = "../../common/header.html";
var isLoggedIn = {
    _value: false,

    set value(loggedIn) {
        this._value = loggedIn;
        this.setBodyClass();
        
    },

    get value() {
        return this._value;
    },

    setBodyClass() {
        if (this._value) {
            document.body.classList.contains("logged-out")
                && document.body.classList.remove("logged-out");
        } else {
            !document.body.classList.contains("logged-out")
                && document.body.classList.add("logged-out");
        }
    },
};

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        getTemplate(path)
            .then(async (response) => {
                const node = document.importNode(response.content, true);
                document.body.prepend(node);
                handleBurgerMenu();
                handleLogOut();
                showCurrentPage();
                
                getLoggedUser();
                isLoggedIn.value = localStorage.getItem("user") ? true : false;
                // securityGuard("../../404.html", isLoggedIn.value);
                if (isLoggedIn.value) {
                    const user = JSON.parse(localStorage.getItem("user"));
                    const avatar = document.querySelectorAll(".user-avatar");
                    avatar.forEach(avatar => getUserAvatar({user: user, parentNode: avatar}));
                    editGreeting(user.firstName);
                }
            });

    }
}

customElements.define("header-component", Header);

const editGreeting = (name) => {
    const greeting = document.getElementById("headerGreeting");
    greeting.appendChild(document.createTextNode(`Hello, ${name}!`));
}

const handleBurgerMenu = () => {
    const burgerMenu = document.body.querySelector(".burger-menu");
    burgerMenu.addEventListener("click", () => {
        document.body.classList.contains("active-nav")
            ? document.body.classList.remove("active-nav")
            : document.body.classList.add("active-nav");
    });
}

const handleLogOut = () => {
    const logOutBtn = document.getElementById("logOutBtn");
    logOutBtn.addEventListener("click", () => {
        logOutUser().then(() => {
            if (!document.body.classList.contains("logged-out")) {
                document.body.classList.add("logged-out");
            }
            isLoggedIn.value = false;
            securityGuard("../../index.html", isLoggedIn.value);
        });
    });
}

const showCurrentPage = () => {
    const navLinks = document.querySelectorAll("#navLinks a.nav-link");
    navLinks.forEach(link => {
        if (window.location.pathname === link.getAttribute("href")) {
            link.classList.add("current-page");
        }
    });
}

window.addEventListener("resize", () => {
    document.body.classList.remove("active-nav");
});