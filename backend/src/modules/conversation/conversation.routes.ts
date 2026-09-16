import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import {
    createConversationController,
    getConversationController,
    getConversationsController,
} from "./conversation.controller.js";

import {
    conversationIdSchema,
    createConversationSchema,
} from "./conversation.schema.js";

const conversationRouter = Router();

conversationRouter.use(authMiddleware);

conversationRouter.post(
    "/",
    validate(createConversationSchema),
    createConversationController
);

conversationRouter.get(
    "/",
    getConversationsController
);

conversationRouter.get(
    "/:conversationId",
    validate(conversationIdSchema),
    getConversationController
);

export default conversationRouter;