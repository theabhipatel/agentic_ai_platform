import "dotenv/config";
import { composio } from "./config/composio.js";

const session = await composio.sessions.create("user_123", {
    toolkits: ["googlesheets"],
});

// --> to get connection url 
// const connection = await session.authorize("googlesheets");
// console.log("Open this URL:", connection.redirectUrl);

const tools = await session.tools();

console.log("Available tools:");

for (const tool of tools) {
    console.log(tool.name);
}