export default class LowerDialogue {
    static setMessage(message?: string) {
        const element = document.querySelector("#lowerDialogue");
        if (message === null || message === "" || message === undefined) {
            element?.classList.add("hide");
        } else {
            element?.classList.remove("hide");
            element!.innerHTML = message;
        }
    }
}
