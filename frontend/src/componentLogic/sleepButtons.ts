import API from "../api";

export default class SleepButtons {
    static localStorageKey = "previousSleep";
    static previosSleepRecord: Date | null;
    static lastNightThreshold = 14;
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
        API.appendRecord(nightOf, sleepTime, awakeTime, quality);
    }
}

function getHHMM(date: Date) {
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
