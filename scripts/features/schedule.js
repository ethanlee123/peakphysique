import { getTemplate } from "../util/getTemplate.js";

// get trainerID from Book Appointment button on profile page
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);
console.log(trainerID);

// #### displayScheduleInfo variables
const trainerFirstName = document.getElementById('trainerFirstName');
const trainerLastName = document.getElementById('trainerLastName');
const apptTime = document.getElementById('appt-time');
const apptDate = document.getElementById('appt-date');

// displayScheduleInfo(trainerFirstName, trainerLastName, apptTime, apptDate);
// using renderScheduleCards instead


// ##########   renderScheduleCards Variables
const scheduleCardPath = "../../common/schedule-card.html";
const scheduleCardTemplate = await getTemplate(scheduleCardPath);
const scheduleList = document.getElementById("scheduleList");
const scheduleCompletedList = document.getElementById("scheduleCompletedList");
const scheduleTabBtns = document.querySelectorAll(".schedule-tabs button");
const db = firebase.firestore();
const scheduleCollection = await db.collection("schedule").get();
var user = firebase.auth().currentUser;

// inserts text inside cards
const insertText = (parentNode, selector, text) => {
    const element = parentNode.querySelector(selector);
    element.appendChild(document.createTextNode(text));
}

// creates upcoming schedule cards depending on if user is trainer or client
// based on firestore "schedule" collection
const renderScheduleCards = () => {
    
    db.collection("user").doc(user.uid).get()
        .then((docSnapshot) => {
            if(docSnapshot.data().role == "trainer") {
                renderScheduleCardsTrainer();
                renderCompletedScheduleCardsTrainer();
                console.log("hello");
            } else {
                renderScheduleCardsClient();
                renderCompletedScheduleCardsClient();
                console.log("getting client cards");
            }
        });
}
// renderScheduleCards();


// ###########################################
// ## NEW
// ###########################################
var schedule = {
    _value: [],
    _tab: "upcoming",

    get value() {
        return this._value;
    },

    get tab() {
        return this._tab;
    },

    set value(schedule) {
        this._value = schedule;
        this.renderScheduleCards(this._tab === "upcoming" ? scheduleList : scheduleCompletedList);
    },

    set tab(tab) {
        this._tab = tab;
        getSchedule(getUserRole(), tab === "upcoming" ? false : true);
    },

    renderSchedulePic(parentNode, data, role) {
        const schedulePic = parentNode.querySelector(".schedule-profile-pic");
        const placeholder = parentNode.querySelector(".no-pic");
        const picURL = data[`${role}ProfilePic`];

        if (picURL) {
            schedulePic.setAttribute("src", picURL);
        } else {
            schedulePic.style.display = "none";
            placeholder.style.display = "block";
            const initials = `${data[`${role}FirstName`].substring(0, 1)} ${data[`${role}LastName`].substring(0, 1)}`;
            insertText(placeholder, ".initials", initials);
        }
    },

    renderScheduleCards(parentNode) {
        const oppositeRole = getUserRole() === "client" ? "trainer" : "client";

        parentNode.innerHTML = "";
        this._value.forEach(schedule => {
            const { data } = schedule;
            const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
            insertText(scheduleCard, ".trainerFirstName", data[`${oppositeRole}FirstName`]);
            insertText(scheduleCard, ".trainerLastName", data[`${oppositeRole}LastName`]);
            insertText(scheduleCard, "#appt-date", data.date);
            insertText(scheduleCard, "#appt-time", data.time);

            const messageToRender = oppositeRole === "client" ? data.initialMsgFromClient : data.bookingMsg;
            messageToRender && insertText(scheduleCard, "#bookingMsg", messageToRender);

            this.renderSchedulePic(scheduleCard, data, oppositeRole);
    
            // cancel button sets appointment to completed
            const cancelAppt = scheduleCard.querySelector(".cancelBtn");
            cancelAppt.addEventListener("click", () => {
                cancelAppointment(schedule.id);
            });
            this._tab === "completed" && cancelAppt.remove();
    
            const viewProfile = scheduleCard.querySelector(".trainerProfile");
            viewProfile.addEventListener("click", () => {
                localStorage.setItem("trainerProfileToDisplay", JSON.stringify(trainer));
                window.location.href = "../../user-profile.html";
            });
    
            parentNode.appendChild(scheduleCard);
        })
    }
};

const getUserRole = () => {
    const user = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));

    if (user) {
        return user.role;
    }
}

const getSchedule = (role, completed = false) => {
    const userFilter = role === "trainer" ? "trainerUserId" : "clientUserId";

    let query = 
        db.collection("schedule")
        .where("completed", "==", completed)
        .where(userFilter, "==", user.uid)
        .orderBy("date", "asc");
    
    query.onSnapshot(res => {
        let updatedSchedule = [];
        res.forEach(doc => {
            updatedSchedule.push({
                id: doc.id,
                data: doc.data()
            });
        });
        schedule.value = updatedSchedule;
    });
}

const cancelAppointment = (id) => {
    db.collection("schedule").doc(id).delete()
    .then(() => {
        console.log("Successfully cancelled appointment!");
    })
    .catch((e) => {
        console.log(e);
    });
}

scheduleTabBtns.forEach(btn =>
    btn.addEventListener("click", () => {
        schedule.tab = btn.dataset.tab;
    })
)

getSchedule(getUserRole, schedule.tab === "upcoming" ? false : true);
// ###########################################

// creates upcoming schedule cards for a trainer
const renderScheduleCardsTrainer = () => {
    scheduleList.innerHTML = "";

    var query = db.collection("schedule").where("completed", "==", false)

    query.where("trainerUserId", "==", user.uid)
    .orderBy("date", "asc")
    .onSnapshot(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().clientFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().clientLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date);
        insertText(scheduleCard, "#appt-time", schedule.data().time);
        insertText(scheduleCard, "#bookingMsg", schedule.data().bookingMsg);


        // cancel button sets appointment to completed
        const cancelAppt = scheduleCard.querySelector(".cancelBtn");
        cancelAppt.addEventListener("click", () => {
            schedule.ref.update({completed: true})
        });

        const viewProfile = scheduleCard.querySelector(".trainerProfile");
            viewProfile.addEventListener("click", () => {
                localStorage.setItem("trainerProfileToDisplay", JSON.stringify(trainer));
                window.location.href = "../../user-profile.html";
            });

        scheduleList.appendChild(scheduleCard);
        })
    });
}
// renderScheduleCards();

// creates upcoming schedule cards for a client
const renderScheduleCardsClient = () => {
    scheduleList.innerHTML = "";

    var query = db.collection("schedule").where("completed", "==", false)

    query.where("clientUserId", "==", user.uid)
    .orderBy("date", "asc")
    .onSnapshot(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().trainerFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().trainerLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date);
        insertText(scheduleCard, "#appt-time", schedule.data().time);
        insertText(scheduleCard, "#bookingMsg", schedule.data().bookingMsg);

        // cancel button sets appointment to completed
        const cancelAppt = scheduleCard.querySelector(".cancelBtn");
        cancelAppt.addEventListener("click", () => {
            schedule.ref.update({completed: true})
        });

        const viewProfile = scheduleCard.querySelector(".trainerProfile");
            viewProfile.addEventListener("click", () => {
                localStorage.setItem("trainerProfileToDisplay", JSON.stringify(trainer));
                window.location.href = "../../user-profile.html";
            });

        scheduleList.appendChild(scheduleCard);
        })
    });
}


// sets appointment to completed in firestore if date is passed
const completeAppt = () => {
    var todayDate = new Date();

    db.collection("schedule").get()
    .then(function(s) {
        s.forEach(schedule => {
            if (schedule.data().date.toDate() < todayDate) {
                schedule.ref.update({completed: true})
            }
        })
    });
}
completeAppt();

// moves completed schedule cards to completed based on firestore "schedule" collection
// orders by date
// trainer-side, views clients
const renderCompletedScheduleCardsTrainer = () => {
    scheduleCompletedList.innerHTML = "";

    var query = db.collection("schedule").where("completed", "==", true)
    
    query.where("trainerUserId", "==", user.uid)
    .orderBy("date", "asc")
    .get()
    .then(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().clientFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().clientLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date);
        insertText(scheduleCard, "#appt-time", schedule.data().time);
        insertText(scheduleCard, "#bookingMsg", schedule.data().bookingMsg);

        scheduleCompletedList.appendChild(scheduleCard);

        })
    })  
    // hides buttons when appt is completed
    .then(() => {
        let cancelBtn = scheduleCompletedList.getElementsByClassName("hideScheduleBtn");
        
        // console.log(cancelBtn.length);
        for (let i = 0; i < cancelBtn.length; i++) {
            cancelBtn[i].style.display = "none";
            }
        })    
}  
// renderCompletedScheduleCards();

// completed schedule cards on client side
const renderCompletedScheduleCardsClient = () => {
    scheduleCompletedList.innerHTML = "";

    var query = db.collection("schedule").where("completed", "==", true);
    
    var query2 = query.where("clientUserId", "==", user.uid);

    query2    
    .orderBy("date", "asc")
    .get()
    .then(function(s) {
        s.forEach(schedule => {

        const scheduleCard = document.importNode(scheduleCardTemplate.content, true);
        
        insertText(scheduleCard, ".trainerFirstName", schedule.data().trainerFirstName);
        insertText(scheduleCard, ".trainerLastName", schedule.data().trainerLastName);
        insertText(scheduleCard, "#appt-date", schedule.data().date);
        insertText(scheduleCard, "#appt-time", schedule.data().time);
        insertText(scheduleCard, "#bookingMsg", schedule.data().bookingMsg);

        scheduleCompletedList.appendChild(scheduleCard);

        })
    })  
    // hides buttons when appt is completed
    .then(() => {
        let cancelBtn = scheduleCompletedList.getElementsByClassName("hideScheduleBtn");
        
        // console.log(cancelBtn.length);
        for (let i = 0; i < cancelBtn.length; i++) {
            cancelBtn[i].style.display = "none";
            }
        })    
}  
