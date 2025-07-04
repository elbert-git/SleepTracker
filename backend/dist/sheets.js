"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetsWrapper = void 0;
const dotenv_1 = __importDefault(require("./dotenv"));
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
class SheetsWrapper {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            // write crednetials json
            const credentials = dotenv_1.default.googleCredentials;
            fs_1.default.writeFileSync(SheetsWrapper.credentialsPath, credentials, "utf-8");
            //
            const auth = new googleapis_1.google.auth.GoogleAuth({
                keyFile: SheetsWrapper.credentialsPath,
                scopes: SheetsWrapper.scopes,
            });
            SheetsWrapper.client = yield auth.getClient();
        });
    }
    static readGoogleSheets() {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = googleapis_1.google.sheets({
                version: "v4",
                auth: SheetsWrapper.client,
            });
            const response = (yield sheets.spreadsheets.values.get({
                spreadsheetId: SheetsWrapper.spreadsheetId,
                range: SheetsWrapper.range,
            })).data;
            const rows = response.values;
            return rows;
        });
    }
    static appendRecord(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheets = googleapis_1.google.sheets({
                version: "v4",
                auth: SheetsWrapper.client,
            });
            const resource = { values: [values] };
            const response = yield sheets.spreadsheets.values.append({
                spreadsheetId: SheetsWrapper.spreadsheetId,
                range: SheetsWrapper.range,
                valueInputOption: "USER_ENTERED",
                insertDataOption: "INSERT_ROWS",
                requestBody: resource,
            });
        });
    }
}
exports.SheetsWrapper = SheetsWrapper;
SheetsWrapper.client = null;
SheetsWrapper.credentialsPath = "./credentials.json";
SheetsWrapper.spreadsheetId = dotenv_1.default.spreadsheetId;
SheetsWrapper.scopes = ["https://www.googleapis.com/auth/spreadsheets"];
SheetsWrapper.range = "Sheet1!A:E";
