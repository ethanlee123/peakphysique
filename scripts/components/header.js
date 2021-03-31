import { logOutUser, getImgFromStorage } from "../api/firebase-queries.js";

import { getTemplate } from "../util/getTemplate.js";
import { getUserAvatar } from "../util/getUserAvatar.js";

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
    }
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
                showCurrentPage();

                let user = localStorage.getItem("user");
                if (user) {
                    user = JSON.parse(user);
                    let profilePic;
                    if (user.profilePic) {
                        const profilePic = await getImgFromStorage(user.profilePic);
                    }

                    editGreeting(user.firstName);
                    const userAvatar = document.querySelectorAll(".user-avatar");
                    userAvatar.forEach(node => getUserAvatar({
                        user: user,
                        parentNode: node,
                        imgURL: profilePic && profilePic
                    }));
                    
                    isLoggedIn.value = true;
                }
                handleLogOut();
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
            localStorage.removeItem("user");
            isLoggedIn.value = false;
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