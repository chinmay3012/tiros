import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root directory (where server.js and .env are)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("Environment variables loaded from:", path.resolve(__dirname, "../.env"));
console.log("PHONEPE_CLIENT_ID:", process.env.PHONEPE_CLIENT_ID ? "Found" : "Not Found");
console.log("PHONEPE_CLIENT_SECRET:", process.env.PHONEPE_CLIENT_SECRET ? "Found" : "Not Found");
