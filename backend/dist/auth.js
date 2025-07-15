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
exports.createPasswordHash = createPasswordHash;
exports.createSecretToken = createSecretToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("./dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createPasswordHash(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        console.log(hashedPassword);
    });
}
function createSecretToken() {
    console.log(crypto_1.default.randomBytes(64).toString("hex"));
}
class Auth {
    static verifyPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, dotenv_1.default.adminPasswordHash);
        });
    }
    static GenerateTokens() {
        const accessToken = jsonwebtoken_1.default.sign(Auth.userObject, dotenv_1.default.jwtSecret, {
        // expiresIn: "30 days",
        });
        const refreshToken = jsonwebtoken_1.default.sign(Auth.userObject, dotenv_1.default.jwtSecret);
        Auth.currentActiveRefreshToken = refreshToken;
        return {
            accessToken,
            refreshToken,
        };
    }
    static refreshTokens(refreshToken) {
        if (refreshToken === Auth.currentActiveRefreshToken) {
            const accessToken = jsonwebtoken_1.default.sign(Auth.userObject, dotenv_1.default.jwtSecret, {
                expiresIn: "30 days",
            });
            return accessToken;
        }
        else {
            throw "refresh token is invalid";
        }
    }
    static invalidateRefreshToken() {
        Auth.currentActiveRefreshToken = null;
    }
}
Auth.currentActiveRefreshToken = null;
Auth.userObject = { user: dotenv_1.default.adminUser };
exports.default = Auth;
