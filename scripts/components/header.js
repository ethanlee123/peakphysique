import { getTemplate } from "./getTemplate.js";

const path = "../../common/header.html";
var isLoggedIn = false;

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        getTemplate(path)
            .then((response) => {
                const node = document.importNode(response.content, true);
                document.body.prepend(node);
                const burgerMenu = document.body.querySelector(".burger-menu");
                burgerMenu.addEventListener("click", () => {
                    document.body.classList.contains("active-nav") ? document.body.classList.remove("active-nav") : document.body.classList.add("active-nav");
                });
            });

    }
}

customElements.define("header-component", Header);

window.addEventListener("resize", () => {
    document.body.classList.remove("active-nav");
});