import { getTemplate } from "../util/getTemplate.js";

const path = "../../common/footer.html";

class Footer extends HTMLElement {
    connectedCallback() {
        getTemplate(path)
            .then((response) => {
                const node = document.importNode(response.content, true);
                document.body.appendChild(node);
            });
    }
}

customElements.define("footer-component", Footer);