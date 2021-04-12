// Capitalizes space-delimited words in a string
export const capitalizeWords = (str) => {
    return str.replace(/\w\S*/g, text => {
        return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
    });
}