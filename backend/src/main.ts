import { sheets } from "googleapis/build/src/apis/sheets";
import Auth from "./auth";
import { SheetsWrapper } from "./sheets";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyparser from "body-parser";
import ENV from "./dotenv";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyparser.json());
app.use(
    cors({
        origin: "*",
    })
);

// auth middleware
function authenthicateRequests(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const authorization = (request.headers as any)[
            "authorization"
        ] as string;
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, ENV.jwtSecret as string);
        (response as any).userObject = decoded;
    } catch (e) {
        response.status(500).json({
            message: "authentication did not go through",
            error: e,
        });
    }
    next();
}

// sign in
app.post("/sign-in", async (req, res) => {
    try {
        const password = req.body.password;
        const username = req.body.username;
        if (
            (await Auth.verifyPassword(password)) &&
            username === ENV.adminUser
        ) {
            const tokens = Auth.GenerateTokens();
            res.json(tokens);
        } else {
            throw "wrong password";
        }
    } catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
});
// sign out
app.post("/sign-out", authenthicateRequests, async (req, res) => {
    try {
        const password = req.body.password;
        if (await Auth.verifyPassword(password)) {
            Auth.invalidateRefreshToken();
            res.json({ message: "signed out" });
        } else {
            throw "wrong password";
        }
    } catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
});
// refresh token
app.post("/refresh-tokens", async (req, res) => {
    try {
        if (req.body.refreshTokens === Auth.currentActiveRefreshToken) {
            const tokens = Auth.GenerateTokens();
            res.json(tokens);
        } else {
            throw "refresh-tokens is invalid";
        }
    } catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
});
//  protected write route
app.post("/append-record", authenthicateRequests, async (req, res) => {
    try {
        const body = req.body;
        await SheetsWrapper.appendRecord([
            body.nightOf,
            body.sleepTime,
            body.awakeTime,
            body.quality,
        ]);
        res.json({ message: "succesful" });
    } catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
});
app.post("/append-weight", authenthicateRequests, async (req, res) => {
    console.log("rescieve weight", req.body.weight);
    try {
        const body = req.body;
        await SheetsWrapper.appendWeight(body.weight);
        res.json({ message: "succesful" });
    } catch (e) {
        res.status(500).json({
            message: "Error occured",
            error: e,
        });
    }
});

app.get("/", async (req, res) => {
    res.status(200).json({ message: "elbert's sleep tracker" });
});

app.listen(ENV.port, async () => {
    console.log("express server on", ENV.port);
    await SheetsWrapper.init();
    // (async () => {
    //     console.log(await SheetsWrapper.appendWeight(23.4));
    //     console.log(await SheetsWrapper.readGoogleSheets());
    // })();
});

console.clear();
