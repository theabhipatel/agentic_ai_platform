// openrouter request response logger via fetch , un comment it when you need to see req and res to llm
// import "./openrouter-logger.js"; 

import { ChatOpenRouter } from "@langchain/openrouter";
import { env } from "./env.js";

export const llm = new ChatOpenRouter({
    model: "inclusionai/ling-3.0-flash-fin:free",
    temperature: 0,
    apiKey: env.openRouterApiKey
});