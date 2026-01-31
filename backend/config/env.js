import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths: backend/.env (local) then root .env (Render/CI)
const backendEnv = path.resolve(__dirname, "../.env");
const rootEnv = path.resolve(process.cwd(), ".env");
dotenv.config({ path: backendEnv });
if (!process.env.PHONEPE_CLIENT_ID) {
  dotenv.config({ path: rootEnv });
}
