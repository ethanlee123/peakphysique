import { getTemplate } from "../util/getTemplate.js";
import { insertText } from "../util/getTrainerText.js";

// ##########   renderScheduleCards Variables
// get trainerID from Book Appointment button on profile page
let trainerID = localStorage.getItem("trainerID");
trainerID = JSON.parse(trainerID);

const db = firebase.firestore();
const scheduleCollection = await db.collection("schedule").get();
var user = firebase.auth().currentUser;

const scheduleCardPath = "../../common/schedule-card.html";
const scheduleCardTemplate = await getTemplate(scheduleCardPath);
const scheduleList = document.getElementById("scheduleList");
const scheduleCompletedList = document.getElementById("scheduleCompletedList");
const scheduleTabBtns = document.querySelectorAll(".schedule-tabs button");

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
            
            const formattedDate = data.date.toDate().toLocaleDateString("en-US");
        
            insertText(scheduleCard, ".trainerFirstName", data[`${oppositeRole}FirstName`]);
            insertText(scheduleCard, ".trainerLastName", data[`${oppositeRole}LastName`]);
            insertText(scheduleCard, "#appt-date", formattedDate);
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