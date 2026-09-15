import { Router } from "express";

import { chatController } from "./chat.controller.js";
import { chatSchema } from "./chat.schema.js";

import { authMiddleware } from "../auth/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

const chatRouter = Router();

chatRouter.post(
    "/",
    authMiddleware,
    validate(chatSchema),
    chatController
);

export default chatRouter;