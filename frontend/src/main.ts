import API from "./api";
import LoginComponent from "./componentLogic/loginCard";
import SleepButtons from "./componentLogic/sleepButtons";
import "./style.css";

// --- --- start up key modules and components
// setup auth logic first
API.onStart();
const loggedIn = API.userObject !== null;
console.log("logged in", loggedIn);
// login card
LoginComponent.onStart();
LoginComponent.setVisible(!loggedIn); // if logged in hide the card
LoginComponent.showLogoutButton(loggedIn); // if logged in show logout button
// handle overwriting visibiility
const params = new URLSearchParams(window.location.search);
const loginShow = params.get("login") === "";
LoginComponent.setVisible(loginShow);
// start sleep buttons
SleepButtons.onStart();

window.addEventListener("keydown", (e) => {
    if (e.key === "1") {
        SleepButtons.recordSleep();
    }
    if (e.key === "2") {
        SleepButtons.recordAwakeAndQuality(1);
    }
});
