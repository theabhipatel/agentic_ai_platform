import "dotenv/config";
import { composio } from "./config/composio.js";

const session = await composio.sessions.create("user_123");

console.log("Session created:", session.sessionId);