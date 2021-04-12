// Returns a template object given a path param
export const getTemplate = (path) => {
    return fetch(path)
        .then(response => {
            return response.text();
        })
        .then((response) => {
            const html = new DOMParser().parseFromString(response, "text/html");
            return html.querySelector("template");
        });
}