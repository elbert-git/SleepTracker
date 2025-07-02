import API from "../api";

export default class SleepButtons {
    // key properties
    static localStorageKey = "previousSleep";
    static lastNightThreshold = 14;
    // key states
    static previosSleepRecord: Date | null;
    //
    static onStart() {
        // load previous sleep time
        try {
            const load = localStorage.getItem(SleepButtons.localStorageKey);
            // const load = "asdfdf";
            SleepButtons.previosSleepRecord = new Date(load as string);
            if (isNaN(SleepButtons.previosSleepRecord.getTime())) {
                throw " failed to load sleep record";
            }
            console.log(
                "last sleep time is",
                SleepButtons.previosSleepRecord.toLocaleString()
            );
        } catch (e) {
            console.log("failed to load sleep record", e);
        }
        // trigger correct graphics
        SleepButtons.setNightMode(new Date().getHours() > 18); // trigger night mode after 6 pm
        // button events
        const sleepButton = document.querySelector("#sleepButton");
        sleepButton!.addEventListener("click", async () => {
            // hide the button
            // save the sleep time
            SleepButtons.recordSleep();
        });
    }
    static recordSleep() {
        const currentTime = new Date();
        localStorage.setItem(SleepButtons.localStorageKey, String(currentTime));
        SleepButtons.previosSleepRecord = currentTime;
        console.log("recorded sleep time as", currentTime.toLocaleTimeString());
    }
    static recordAwakeAndQuality(rating: number) {
        // get obvious parameters
        const quality = rating;
        const nightOf = getYesterdaysDateYYMMDD();
        const awakeTime = getHHMM(new Date());

        // check what to put as sleep time
        let sleepTime = "00:00";
        // if valid previous sleep revord exist use it,
        if (SleepButtons.previosSleepRecord) {
            const duration =
                new Date().getTime() -
                SleepButtons.previosSleepRecord.getTime();
            const durationInHours = duration / (1000 * 60 * 60);
            if (durationInHours < SleepButtons.lastNightThreshold) {
                sleepTime = getHHMM(SleepButtons.previosSleepRecord);
            }
        }
        try {
            (async () => {
                await API.appendRecord(nightOf, sleepTime, awakeTime, quality);
            })();
        } catch (e) {
            alert("record update failed");
        }
    }
    static setNightMode(b: boolean) {
        if (b) {
            document.querySelector(".night-bg")?.classList.remove("none");
            document.querySelector(".night-fg")?.classList.remove("none");
            document.querySelector(".morning-bg")?.classList.add("none");
            document.querySelector(".moring-fg")?.classList.add("none");
        } else {
            document.querySelector(".night-bg")?.classList.add("none");
            document.querySelector(".night-fg")?.classList.add("none");
            document.querySelector(".morning-bg")?.classList.remove("none");
            document.querySelector(".moring-fg")?.classList.remove("none");
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
