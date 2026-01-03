import { config } from "dotenv";

// Load environment-specific .env file
const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
config({ path: envFile });

const isProduction = process.env.NODE_ENV === "production";

export default {
    schema: "./src/models/*.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: isProduction ? "require" : false,
    },
};
