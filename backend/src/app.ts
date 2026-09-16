import 'dotenv/config'
import express from "express";
import cors from "cors";
import authRouter from './modules/auth/auth.routes.js';
import chatRouter from './modules/chat/chat.routes.js';
import agentRouter from './modules/agent/agent.routes.js';
import conversationRouter from './modules/conversation/conversation.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        message: "AI Agent API is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/agent", agentRouter);
app.use("/api/conversations", conversationRouter);

export default app;

