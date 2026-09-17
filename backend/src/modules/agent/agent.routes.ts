import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";
import {
    googleSheetsAuthController,
    googleSheetsStatusController,
} from "./agent.controller.js";

const agentRouter = Router();

agentRouter.get(
    "/google-sheets/auth",
    authMiddleware,
    googleSheetsAuthController
);

agentRouter.get(
    "/google-sheets/status",
    authMiddleware,
    googleSheetsStatusController
);

export default agentRouter;