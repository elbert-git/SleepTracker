import ENV from "./dotenv";
import { google, sheets_v4 } from "googleapis";
import fs from "fs";

export class SheetsWrapper {
    static client: any = null;
    static credentialsPath = "./credentials.json";
    static spreadsheetId = ENV.spreadsheetId;
    static scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    static range = "Sheet1!A:E";
    static async init() {
        // write crednetials json
        const credentials = ENV.googleCredentials;
        fs.writeFileSync(
            SheetsWrapper.credentialsPath,
            credentials as string,
            "utf-8"
        );
        //
        const auth = new google.auth.GoogleAuth({
            keyFile: SheetsWrapper.credentialsPath,
            scopes: SheetsWrapper.scopes,
        });
        SheetsWrapper.client = await auth.getClient();
    }
    static async readGoogleSheets() {
        const sheets = google.sheets({
            version: "v4",
            auth: SheetsWrapper.client,
        });
        const response: sheets_v4.Schema$ValueRange = (
            await sheets.spreadsheets.values.get({
                spreadsheetId: SheetsWrapper.spreadsheetId,
                range: SheetsWrapper.range,
            })
        ).data;

        const rows: sheets_v4.Schema$ValueRange["values"] = response.values;
        return rows;
    }
    static async appendRecord(values: Array<string>) {
        const sheets = google.sheets({
            version: "v4",
            auth: SheetsWrapper.client,
        });
        const resource: sheets_v4.Schema$ValueRange = { values: [values] };
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SheetsWrapper.spreadsheetId,
            range: SheetsWrapper.range,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: resource,
        });
    }
}
