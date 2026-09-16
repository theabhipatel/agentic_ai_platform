import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import {
    createConversationController,
    deleteConversationController,
    getConversationController,
    getConversationMessagesController,
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
    "/:conversationId/messages",
    validate(conversationIdSchema),
    getConversationMessagesController
);

conversationRouter.get(
    "/:conversationId",
    validate(conversationIdSchema),
    getConversationController
);

conversationRouter.delete(
    "/:conversationId",
    validate(conversationIdSchema),
    deleteConversationController
);


export default conversationRouter;