import { getTemplate } from "./getTemplate.js";

const path = "../../common/footer.html";

class Footer extends HTMLElement {
    connectedCallback() {
        const response = getTemplate(path)
            .then((response) => {
                const node = document.importNode(response.content, true);
                document.body.appendChild(node);
            });
    }
}

customElements.define("footer-component", Footer);