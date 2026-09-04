import { ChatOpenRouter } from "@langchain/openrouter";

export const llm = new ChatOpenRouter({
    model: "minimax/minimax-m3:free",
    temperature: 0,
    apiKey: process.env.OPENROUTER_API_KEY!
});