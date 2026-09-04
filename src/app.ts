import 'dotenv/config'
import express from "express";
import { HumanMessage } from "@langchain/core/messages";
import { llm } from "./config/llm.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "AI Agent API is running"
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await llm.invoke([
            new HumanMessage(message)
        ]);

        res.json({
            response: response.content
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

export default app;