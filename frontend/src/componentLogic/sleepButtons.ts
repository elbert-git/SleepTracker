import API from "../api";
import States from "../State";

export default class SleepButtons {
    // key properties
    static localStorageKey = "previousSleep";
    // static localStorageKey = "previousSleep";
    static lastNightThreshold = 14;
    // key states
    static previosSleepRecord: Date | null;
    static previousAwakeRecord: Date | null;
    // on start
    static onStart() {
        // button events
        const sleepButton = document.querySelector("#sleepButton");
        sleepButton!.addEventListener("click", async () => {
            // hide the button
            // save the sleep time
            SleepButtons.recordSleep();
        });
        const allRatingButtons = document.querySelectorAll(".rating-button");
        for (let index = 0; index < allRatingButtons.length; index++) {
            const element = allRatingButtons[index] as any;
            element.addEventListener("click", async () => {
                // deactivate buttons first
                element.disabled = true;
                // sleep buttons
                await SleepButtons.recordAwakeAndQuality(index + 1);
                // actibate buttons first
                element.disabled = false;
            });
        }
    }
    static recordSleep() {
        // on sleep save it to local cache
        States.cache.sleepRecord = new Date();
        // save it to disc
        States.saveStateToDisc();
        // update ui
        States.updateUI();
    }
    static async recordAwakeAndQuality(rating: number) {
        // save to disk
        States.cache.morningRecord = new Date();
        // save it to disc
        States.saveStateToDisc();

        // set correct sleepItme
        let sleepTime = "null";
        if (
            States.cache.sleepRecord != null ||
            States.cache.sleepRecord != undefined
        ) {
            if (States.evaluateSleepRecord().sleptRecently) {
                sleepTime = getHHMM(States.cache.sleepRecord);
            }
        }
        // make the request
        const quality = rating;
        const nightOf = getYesterdaysDateYYMMDD();
        const awakeTime = getHHMM(new Date());

        try {
            await API.appendRecord(nightOf, sleepTime, awakeTime, quality);
            // update ui if successful
            States.updateUI();
        } catch (e) {
            alert("record update failed");
        }
    }
    static toggleNightUI(b: boolean) {
        if (b) {
            document.querySelector(".night-overlay")?.classList.remove("none");
        } else {
            document.querySelector(".night-overlay")?.classList.add("none");
        }
    }
    static toggleMorningUI(b: boolean) {
        if (b) {
            document
                .querySelector(".morning-overlay")
                ?.classList.remove("none");
        } else {
            document.querySelector(".morning-overlay")?.classList.add("none");
        }
    }
}

export function getHHMM(date: Date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
}

function getYesterdaysDateYYMMDD() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const year = yesterday.getFullYear().toString().slice(-2);
    const month = (yesterday.getMonth() + 1).toString().padStart(2, "0");
    const day = yesterday.getDate().toString().padStart(2, "0");

    return `${year}/${month}/${day}`;
}
