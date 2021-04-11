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

// Redirects the user to a given path ...
// if they are on an auth-restricted path, and are not logged in
export const securityGuard = (redirectPath, isLoggedIn) => {
    const pageName = window.location.pathname.split("/").pop().split(".")[0];
    if (restrictedPaths.includes(pageName) && !isLoggedIn) {
        window.location.href = redirectPath;
    }
}