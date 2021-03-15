// import { getTemplate } from "./getTemplate.js";

// const path = "../../common/header.html";

// class Header extends HTMLElement {
//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         getTemplate(path)
//             .then((response) => {
//                 const node = document.importNode(response.content, true);
//                 document.body.prepend(response.content);
//             });
//     }
// }

// customElements.define("header-component", Header);

// Common logged in header component, add <header-component> to html and this script to bottom
class Header extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
            <header id="#header">
                <div class="burger-menu" id="#burgerMenu">
                <span class="top-bun"></span>
                <span class="patty"></span>
                <span class="btm-bun"></span>
                </div>
                <!--.burger-->
        
                <a href="/index.html" class="logo">
                <i class="icon icon-logo"></i>
                <span class="text">Peak <b>Physique</b></span>
                </a>
        
                <nav>
                <a href="/index.html" class="logo">
                    <i class="icon icon-logo"></i>
                    <span class="text">Peak <b>Physique</b></span>
                </a>
                <ul>
                    <li><a class="user-profile" href="#0">
                        <i class="fas fa-user-circle"></i>
                        <div class="text">
                        <span class="greeting">Hello, John!</span>
                        <span class="edit-profile">Edit my <b>Profile</b></span>
                        </div>
                        <!--.text-->
                    </a></li>
                    <li class="messages"><a href="#0">
                        <span id="notifications" class="notifications"></span>
                        <i class="fas fa-inbox"></i>
                        <span class="text">Check my <b>messages</b></span>
                    </a></li>
                    <li><a href="/index.html">
                        <i class="fas fa-home"></i>
                        Home
                    </a></li>
                    <li><a href="/schedule.html">
                        <i class="fas fa-clock"></i>
                        My fitness <b>schedule</b>
                    </a></li>
                    <li><a href="/find-a-trainer.html">
                        <i class="fas fa-user"></i>
                        Find a <b>trainer</b>
                    </a></li>
                    <li><a href="#0">
                        <i class="fas fa-users"></i>
                        Join a <b>group class</b>
                    </a></li>
                </ul>
                </nav>
        
                <div class="account">
                <i class="fas fa-user-plus"></i>
                <button id="signupBtn" class="btn btn-outline-light login">Log In</button>
                <button id="signupBtn" class="btn btn-primary signup">Sign Up</button>
                <div class="user">
                    <a class="user-profile" href="#0">
                    <i class="fas fa-user-circle"></i>
                    <div class="text">
                        <span class="greeting">Hello, John!</span>
                        <span class="edit-profile">Edit my <b>Profile</b></span>
                    </div>
                    <!--.text-->
                    </a>
                    <!--.user-profile-->
                    <a class="messages" href="#0">
                    <div class="icon">
                        <span id="notifications" class="notifications"></span>
                        <i class="fas fa-inbox"></span></i>
                    </div>
                    <!--.icon-->
                    </a>
                    <!--.message-->
                </div>
                <!--.user-->
        
                <button id="signupBtn" class="btn btn-outline-light logout">Log Out</button>
                </div>
                <!--.account-->
            </header>
        `;
    }
}

customElements.define("header-component", Header);



// Animation for hamburger menu at smaller resolutions
var isLoggedIn = false;

const burgerMenu = document.getElementById("burgerMenu");
burgerMenu.addEventListener("click", () => {
    document.body.classList.contains("active-nav") ? document.body.classList.remove("active-nav") : document.body.classList.add("active-nav");
});

window.addEventListener("resize", () => {
    getComputedStyle(burgerMenu).display === "none" && document.body.classList.remove("active-nav");
});


