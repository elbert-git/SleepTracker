import API from "./api";
import LoginComponent from "./componentLogic/loginCard";
import SleepButtons, { getHHMM } from "./componentLogic/sleepButtons";
import States from "./State";
import "./style.css";

// --- --- start up key modules and components
// setup auth logic first
API.onStart();
const loggedIn = API.userObject !== null;
console.log("logged in", loggedIn); // login card
LoginComponent.onStart();
LoginComponent.setVisible(!loggedIn); // if logged in hide the card
LoginComponent.showLogoutButton(loggedIn); // if logged in show logout button
// handle overwriting visibiility
const params = new URLSearchParams(window.location.search);
const loginShow = params.get("login") === "";
LoginComponent.setVisible(loginShow);
// hanlde states
States.onStart();
// start sleep buttons
SleepButtons.onStart();

// handle clock
document.querySelector(".time")!.innerHTML = getHHMM(new Date());
setInterval(() => {
    document.querySelector(".time")!.innerHTML = getHHMM(new Date());
}, 1000);
