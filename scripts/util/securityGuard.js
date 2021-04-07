const restrictedPaths = [
    "book-appointment",
    "messages-notifications",
    "schedule",
    "sign-up-platform-specific",
    "sign-up-profile-setup",
    "sign-up-success",
    "sign-up-trainer-expertise",
    "sign-up-user-profile",
    "trainer-profile-self",
];

export const securityGuard = (redirectPath, isLoggedIn) => {
    const pageName = window.location.pathname.split("/").pop().split(".")[0];
    if (restrictedPaths.includes(pageName) && !isLoggedIn) {
        window.location.href = redirectPath;
    }
}