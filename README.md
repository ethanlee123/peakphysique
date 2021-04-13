## My Web Application (Title)

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
Peak Physique is a web-based application that provides a platform for connecting fitness professionals and their clients. It allows for booking of one-on-one appointments with personal trainers, and attending online group classes with other members. 
	
## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap 
* Firebase
* HERE API
* GeoLocation API
* GoogleMaps Geocoding API
* Datepicker jQuery API
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore                                  # Git ignore file
├── index.html                                  # landing HTML file, this is what users see when you come to url
├── 404.html
├── book-appointment.html
├── find-a-trainer.html
├── login-sign-up.html
├── messages-notifications.html
├── package-lock.json
├── package.json
├── schedule.html
├── sign-up-platform-specific.html
├── sign-up-profile-setup.html
├── sign-up-success.html
├── sign-up-trainer-expertise.html
├── sign-up-user-profile.html
├── trainer-profile-self.html                   #deprecated, using user-profile.html
├── under-construction.html
├── user-profile.html
└── README.md


It has the following subfolders and files:
├── .git                                        # Folder for git repo
├── .vscode                                     # Folder for vscode settings
    /settings.json
├── common                                      # Folder for common HTML elements
    /footer.html
    /header.html
    /schedule-card.html
    /trainer-card.html
├── fontsize                                    # Folder for fonts
    /apexmk2-boldextended-webfont.woff
    /apexmk2-boldextended-webfont.woff2
    /fontello.eot
    /fontello.svg
    /fontello.ttf
    /fontello.woff
    /fontello.woff2
├── images                                      # Folder for images
    ├── favicon              
    ├── icons                                   # Folder for icons, from fontAwesome  
    /blah.jpg
    /group-classes.jfif
    /gym-banner.jfif
    /gym-workout.jfif
    /home-workout.jfif
    /login-banner.jpg
    /logo-mint.svg
    /logo.svg
    /minions-1.gif
    /minions-2.gif
    /outdoor-training.jfif
    /profile-placeholder.svg
    /settings-icon.svg
    /target-icon.svg
    /trainer-directory-banner.jpg
    /trainer-profile-pic.jpg
├── node_modules                                # Node Modules  
├── scripts                                     # Folder for scripts
    ├── api                                     # API scripts
        /firebase_api_team37.js
        /firebase-queries.js        
        /here-api.js
        /token.js
    ├── components                              # Component-specific scripts
        /date-picker.js
        /footer.js
        /header.js
    ├── features                                # HTML page-specific scripts
        /book-appointment.js
        /find-a-trainer.js
        /index.js
        /login-sign-up.js
        /schedule.js
        /sign-up-expertise.js
        /sign-up-platform-specific.js
        /sign-up-profile-setup.js
        /sign-up-success.js
        /sign-up-user-profile.js
        /user-profile.js
    ├── jquery                                  # jQuery scripts
        ├── multiselect
        ├── nouislider
    ├── util                                    # Utility-specific scripts
        /capitalizeWords.js
        /debounce.js
        /generateTestData.js
        /generateUnavailableSlots.js
        /getGeoPointDistance.js
        /getTemplate.js
        /getTrainerText.js
        /getUserAvatar.js
        /securityGuard.js
    /schema.js                                  # Script planning js
├── scss                                        # Folder for Sass styles   
    ├── components                              # Component-specific Sass styles
        /_accordion.scss
        /_auth.scss
        /_body.scss
        /_button.scss
        /_filter-multi-select.scss
        /_footer.scss
        /_header.scss
        /_input.scss
        /_main.scss
        /_modal.scss
        /_range-slider.scss
        /_text-toggle.scss
        /_user-avatar.scss
    ├── features                                # HTML page-specific Sass styles
        /_book-appointment.scss
        /_find-a-trainer.scss
        /_index.scss
        /_initial-platform-specific.scss
        /_initial-trainer-expertise.scss
        /_initial-trainer-setup.scss
        /_login-sign-up.scss
        /_messages-notifications.scss
        /_misc.scss
        /_profile.scss
        /_schedule.scss
        /_sign-up-sucess.scss
        /_sign-up-user-info.scss
        /_trainer-create-account.scss
        /_trainer-signup-form.scss
        /_user_profile.scss
    /_mixins.scss
    /_types.scss
    /_variables.scss
    /custom.scss             
├── sign_up_trainer                             # Folder for trainer sign up HTML pages, deprecated
    /create-account.html
    /empty-form.html
└── styles                                      # Folder for CSS styles
    /fontello.css
    /style.css
Firebase hosting files: 
├── .firebaserc...


```

## Citations: pictures, libraries, API's etc.
Bootstrap v5.0.0-beta3 
getbootstrap.com/

Icons from Fontello
fontello.com/

APEX font from FontAwesome
fontawesome.com/

Stock Photos from Unsplash Images
unsplash.com/


Tips for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation

