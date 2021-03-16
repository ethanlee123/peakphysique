This folder contains site wide common components such as the logged in/out header, footer



peakphys
    index.html

    peakphysique.com/home -> sign-up
        /home.html
    peakphysique.com/sign-up (sign-up.html is at root folder) -> verification
        /sign-up.html
    peakphysique.com/sign-up/verification (verification.html is in "sign-up" folder) -> account details
        /sign-up/verification.html
    peakphysique.com/sign-up/account-details (account-details.html is in "sign-up" folder)
        /sign-up/verification.html

    feature1 folder
    feature2 folder
    -----------------------------------------------------------------------------------------------
    peakphysique.com/home -> sign-up
    peakphysique.com/sign-up (page containing widget) -> sign-up-verification
    peakphysique.com/sign-up/verification -> trainer
    
    
    peakphysique (folder root level)
        index.html
        find-a-trainer.html
        book-an-appointment.html
        schedule.html (trainer and client)
        profile.html (trainer and client)
        edit-profile.html (trainer and client)
        sign-up.html
        login.html
        *messages-notifications.html (not core feature)
        *manage-clients.html (not core feature) 
        
        sign-up folder
            verification.html
            form.html
            account.html

            account folder
                description.html 
                my-expertise.html
                platform-specific.html


"(trainer and client)" will both have unique versions

    
    We could use js/jquery to add components that are trainer (or client) specific
    OR should we build the full html pg and remove components according to whether they are a trainer (or a client)

