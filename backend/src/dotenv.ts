import * as dotenv from "dotenv";

dotenv.config();

const ENV = {
    port: process.env.PORT,
    adminUser: process.env.ADMIN_USER,
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
    jwtSecret: process.env.JWT_SECRET,
    spreadsheetId: process.env.SPREADSHEET_ID,
    googleCredentials: process.env.GOOGLE_CREDENTIALS,
};

export default ENV;
