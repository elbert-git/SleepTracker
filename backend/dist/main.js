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
const auth_1 = __importDefault(require("./auth"));
const sheets_1 = require("./sheets");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("./dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
// auth middleware
function authenthicateRequests(request, response, next) {
    try {
        const authorization = request.headers["authorization"];
        const token = authorization.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, dotenv_1.default.jwtSecret);
        response.userObject = decoded;
    }
    catch (e) {
        response.status(500).json({
            message: "authentication did not go through",
            error: e,
        });
    }
    next();
}
// sign in
app.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const username = req.body.username;
        if ((yield auth_1.default.verifyPassword(password)) &&
            username === dotenv_1.default.adminUser) {
            const tokens = auth_1.default.GenerateTokens();
            res.json(tokens);
        }
        else {
            throw "wrong password";
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
}));
// sign out
app.post("/sign-out", authenthicateRequests, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        if (yield auth_1.default.verifyPassword(password)) {
            auth_1.default.invalidateRefreshToken();
            res.json({ message: "signed out" });
        }
        else {
            throw "wrong password";
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
}));
// refresh token
app.post("/refresh-tokens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.refreshTokens === auth_1.default.currentActiveRefreshToken) {
            const tokens = auth_1.default.GenerateTokens();
            res.json(tokens);
        }
        else {
            throw "refresh-tokens is invalid";
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
}));
//  protected write route
app.post("/append-record", authenthicateRequests, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        yield sheets_1.SheetsWrapper.appendRecord([
            body.nightOf,
            body.sleepTime,
            body.awakeTime,
            body.quality,
        ]);
        res.json({ message: "succesful" });
    }
    catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
}));
app.post("/append-weight", authenthicateRequests, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("rescieve weight", req.body.weight);
    try {
        const body = req.body;
        yield sheets_1.SheetsWrapper.appendWeight(body.weight);
        res.json({ message: "succesful" });
    }
    catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
}));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ message: "elbert's sleep tracker built 250716" });
}));
app.listen(dotenv_1.default.port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("express server on", dotenv_1.default.port);
    yield sheets_1.SheetsWrapper.init();
    // (async () => {
    //     console.log(await SheetsWrapper.appendWeight(23.4));
    //     console.log(await SheetsWrapper.readGoogleSheets());
    // })();
}));
console.clear();
