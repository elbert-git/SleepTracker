const baseUrl = "http://localhost:3000";

export default class API {
    static userObject: Object | null = null;
    static localStorageKey = "sleeptracker";
    static onStart() {
        // rememver logged in state
        try {
            API.userObject = JSON.parse(
                localStorage.getItem(API.localStorageKey) as string
            );
        } catch (e) {
            console.log("failed to load login state");
            API.userObject = null;
        }
    }
    static async logout() {
        API.userObject = null;
        localStorage.removeItem(API.localStorageKey);
    }
    static async login(username: string, password: string) {
        try {
            // attempt to login
            const res = await fetch(`${baseUrl}/sign-in`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            const resjson = await res.json();
            console.log(resjson);
            //  save login state to localstage
            if (res.status === 200) {
                localStorage.setItem(
                    API.localStorageKey,
                    JSON.stringify(resjson)
                );
            }
            return {
                pass: true,
                body: resjson,
            };
        } catch (e) {
            return {
                pass: false,
                error: "login failed",
            };
        }
    }
    static async appendRecord(
        date: string,
        sleepTime: string,
        awakeTime: string,
        quality: number
    ) {
        try {
            // make the fetch
            console.log(API.userObject);
            const res = await fetch(`${baseUrl}/append-record`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${
                        (API.userObject! as any).accessToken
                    }`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nightOf: date,
                    sleepTime: sleepTime,
                    awakeTime: awakeTime,
                    quality: quality,
                }),
            });
            const resJson = await res.json();
            console.log(resJson);
            if (res.status !== 200) {
                throw "request failed";
            }
        } catch (e) {
            alert("request failed");
            console.log(e);
        }
    }
}
