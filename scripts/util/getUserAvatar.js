export const getUserAvatar = ({
    user,
    parentNode,
    imgURL = "",
    profilePicSelector = ".user-avatar img",
    userInitialsSelector = ".initials"
}) => {
    const profilePic = parentNode.querySelector(profilePicSelector);
    const userInitials = parentNode.querySelector(userInitialsSelector);

    if (user.profilePic || imgURL) {
        userInitials.remove();
        profilePic.setAttribute("src", imgURL ? imgURL : user.profilePic);
        profilePic.setAttribute("alt", `${user.name} avatar`);
    } else {
        profilePic.remove();
        const initials = `${user.firstName?.substring(0, 1)} ${user.lastName?.substring(0, 1)}`;
        userInitials.appendChild(document.createTextNode(initials));
    }
}