import bcrypt from "bcrypt";
import crypto from "crypto";
import ENV from "./dotenv";
import jwt from "jsonwebtoken";

export async function createPasswordHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
}

export function createSecretToken() {
    console.log(crypto.randomBytes(64).toString("hex"));
}

export default class Auth {
    static currentActiveRefreshToken: string | null = null;
    static userObject = { user: ENV.adminUser };
    static async verifyPassword(password: string) {
        return await bcrypt.compare(password, ENV.adminPasswordHash as string);
    }
    static GenerateTokens() {
        const accessToken = jwt.sign(Auth.userObject, ENV.jwtSecret as string, {
            // expiresIn: "30 days",
        });
        const refreshToken = jwt.sign(Auth.userObject, ENV.jwtSecret as string);
        Auth.currentActiveRefreshToken = refreshToken;
        return {
            accessToken,
            refreshToken,
        };
    }
    static refreshTokens(refreshToken: string) {
        if (refreshToken === Auth.currentActiveRefreshToken) {
            const accessToken = jwt.sign(
                Auth.userObject,
                ENV.jwtSecret as string,
                {
                    expiresIn: "30 days",
                }
            );
            return accessToken;
        } else {
            throw "refresh token is invalid";
        }
    }
    static invalidateRefreshToken() {
        Auth.currentActiveRefreshToken = null;
    }
}
