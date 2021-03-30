import { watchUser, logOutUser } from "../api/firebase-queries.js";

import { getTemplate } from "../util/getTemplate.js";

const path = "../../common/header.html";
var isLoggedIn = false;
const routes = [
    "index",
    "schedule",
    "find-a-trainer",
    "group-class"
];

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        getTemplate(path)
            .then((response) => {
                const node = document.importNode(response.content, true);
                document.body.prepend(node);
                handleBurgerMenu();
                handleLogOut();
                showCurrentPage();

                let user = localStorage.getItem("user");
                console.log(user);
                if (user) {
                    user = JSON.parse(user);
                    editGreeting(user.firstName);
                    if (document.body.classList.contains("logged-out")) {
                        document.body.classList.remove("logged-out");
                    }
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
        document.body.classList.contains("active-nav") ? document.body.classList.remove("active-nav") : document.body.classList.add("active-nav");
    });
}

const handleLogOut = async () => {
    await logOutUser();
    if (!document.body.classList.contains("logged-out")) {
        document.body.classList.add("logged-out");
    }
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

watchUser();