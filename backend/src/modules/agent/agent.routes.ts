import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";
import {
    googleSheetsAuthController,
} from "./agent.controller.js";

const agentRouter = Router();

agentRouter.get(
    "/google-sheets/auth",
    authMiddleware,
    googleSheetsAuthController
);

export default agentRouter;