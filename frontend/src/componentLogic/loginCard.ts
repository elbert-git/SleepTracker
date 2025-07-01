import API from "../api";

export default class LoginComponent {
    // static userNameField = document.querySelector("");
    static elLoginRoot = document.querySelector(
        ".login-overlay"
    )! as HTMLElement;
    static elUserNameField = document.querySelector(
        "#username"
    ) as HTMLInputElement;
    static elPasswordField = document.querySelector(
        "#password"
    ) as HTMLInputElement;
    static elLoginForm = document.querySelector(
        ".login-form"
    ) as HTMLInputElement;
    static elLogoutButton = document.querySelector(
        "#logoutButton"
    ) as HTMLInputElement;

    static onStart() {
        // assign button events
        document
            .querySelector("#loginButton")
            ?.addEventListener("click", async () => {
                // get login parameters
                const username = LoginComponent.elUserNameField.value;
                // const password = LoginComponent.elPasswordField.value;
                const password = "P@assword123";
                // clear password key
                LoginComponent.elPasswordField.value = "";
                // attempt to login auth
                const result = await API.login(username, password);
                // if successfull redirecto to origin
                if (result.pass) {
                    window.location.href = window.location.origin;
                } else {
                    alert("authentication failed");
                }
            });
        document
            .querySelector("#logoutButton")
            ?.addEventListener("click", async () => {
                // clear local storage
                API.logout();
                // refresh
                window.location.reload();
            });
    }

    static setVisible(b: boolean) {
        console.log("setting visible", b);
        if (b) {
            LoginComponent.elLoginRoot.classList.remove("none");
        } else {
            LoginComponent.elLoginRoot.classList.add("none");
        }
    }
    static showLogoutButton(b: boolean) {
        if (b) {
            LoginComponent.elLoginForm.classList.add("none");
            LoginComponent.elLogoutButton.classList.remove("none");
        } else {
            LoginComponent.elLoginForm.classList.remove("none");
            LoginComponent.elLogoutButton.classList.add("none");
        }
    }
}
