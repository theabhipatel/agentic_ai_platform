import 'dotenv/config'
import express from "express";
import { HumanMessage } from "@langchain/core/messages";
import { agent } from './agent.js';
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "AI Agent API is running"
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await agent.invoke({
            messages: [
                new HumanMessage(message)
            ]
        }, {
            configurable: {
                thread_id: "user_123"
            }
        }
        );

        res.json({
            response: response.messages.at(-1)?.content
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

export default app;

