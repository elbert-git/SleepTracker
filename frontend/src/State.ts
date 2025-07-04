import LowerDialogue from "./componentLogic/lowerDialogue";
import SleepButtons, { getHHMM } from "./componentLogic/sleepButtons";

interface ApplicationState {
    sleepRecord: Date | null;
    morningRecord: Date | null;
}

export default class States {
    static localStorageKey = "sleepTrackerRecords";
    static cache: ApplicationState = {
        sleepRecord: null,
        morningRecord: null,
    };
    // static cache:
    static onStart() {
        // attempt to load
        try {
            const raw = localStorage.getItem(States.localStorageKey);
            const parse = JSON.parse(raw!);
            if (parse === null) {
                throw "failed to load";
            }
            States.cache = {
                morningRecord: new Date(parse.morningRecord),
                sleepRecord: new Date(parse.sleepRecord),
            };
            if (States.cache === null) {
                throw "failed to load";
            }
        } catch (e) {
            // if failure load an empy and save it
            States.cache = {
                sleepRecord: null,
                morningRecord: null,
            };
            States.saveStateToDisc();
        }
        console.log("states loaded", States.cache);
        // update ui
        States.updateUI();
    }
    static updateUI() {
        // check if night> less than 5 and more than 8
        const isNight = new Date().getHours() < 5 || new Date().getHours() > 18;
        console.log("is night", isNight);
        States.toggleNightBG(isNight); // trigger night mode after 6 pm
        // correct ui elements
        const sleepRecord = States.evaluateSleepRecord();
        // only turn on awake ui, if morning and no recent lseep record
        if (isNight) {
            // turn morning ui off
            SleepButtons.toggleMorningUI(false);
            // if night show night ui
            // vased on slept recently, show message or sleep buttons
            if (sleepRecord.sleptRecently) {
                //  display message
                LowerDialogue.setMessage(
                    `Slept at ${getHHMM(States.cache.sleepRecord!)}`
                );
                SleepButtons.toggleNightUI(false);
            } else {
                //  show night ui
                SleepButtons.toggleNightUI(true);
            }
        } else {
            // turn nigth ui off
            SleepButtons.toggleNightUI(false);
            // if morning show morning ui
            // vased on slept recently, show message or rating buttons
            if (sleepRecord.awokeRecently) {
                //  display message
                LowerDialogue.setMessage(
                    `Awoke at ${getHHMM(States.cache.morningRecord!)}`
                );
                SleepButtons.toggleMorningUI(false);
            } else {
                //  show morning ui
                SleepButtons.toggleMorningUI(true);
            }
        }
    }
    static saveStateToDisc() {
        localStorage.setItem(
            States.localStorageKey,
            JSON.stringify(States.cache)
        );
    }
    static toggleNightBG(b: boolean) {
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
    static evaluateSleepRecord() {
        const final = {
            sleptRecently: false,
            awokeRecently: false,
        };
        if (
            States.cache.morningRecord != null ||
            States.cache.morningRecord != undefined
        ) {
            const duration =
                States.cache.morningRecord.getTime() - new Date().getTime();

            console.log(duration / (1000 * 60 * 60));
            const isLongerThan12Hours = duration / (1000 * 60 * 60) < -12;
            if (!isLongerThan12Hours) {
                final.awokeRecently = true;
            }
        }
        if (
            States.cache.sleepRecord != null ||
            States.cache.sleepRecord != undefined
        ) {
            const duration =
                States.cache.sleepRecord.getTime() - new Date().getTime();
            console.log(duration / (1000 * 60 * 60));
            const isLongerThan12Hours = duration / (1000 * 60 * 60) < -12;
            if (!isLongerThan12Hours) {
                final.sleptRecently = true;
            }
        }
        console.log(final);
        return final;
    }
}
