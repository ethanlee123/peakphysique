export const getUserAvatar = ({
    user,
    parentNode,
    profilePicSelector = ".user-avatar img",
    userInitialsSelector = ".initials"
}) => {
    const profilePic = parentNode.querySelector(profilePicSelector);
    const userInitials = parentNode.querySelector(userInitialsSelector);
    if (user?.profilePic) {
        userInitials.remove();
        profilePic.setAttribute("src", user?.profilePic);
        profilePic.setAttribute("alt", `${user?.name} avatar`);
    } else {
        profilePic.remove();
        const initials = `${user?.firstName?.substring(0, 1)} ${user?.lastName?.substring(0, 1)}`;
        userInitials.appendChild(document.createTextNode(initials));
    }
}

export const getEditProfAvatar = ({
    user,
    parentNode,
    profilePicSelector = ".user-avatar img",
    userInitialsSelector = ".initials",
    firstName,
    lastName,
    profilePicPath,
}) => {
    const profilePic = parentNode.querySelector(profilePicSelector);
    const userInitials = parentNode.querySelector(userInitialsSelector);
    if (profilePicPath) {
        userInitials.remove();
        profilePic.setAttribute("src", profilePicPath);
        profilePic.setAttribute("alt", `${user?.name} avatar`);
        console.log("getEditProfAvatar");
    } else {
        const initials = `${firstName.substring(0, 1)} ${lastName.substring(0, 1)}`;
        userInitials.innerText = initials;
    }
}