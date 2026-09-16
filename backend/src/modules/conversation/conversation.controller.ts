import type { Request, Response } from "express";

import {
    createConversation,
    getUserConversations,
} from "./conversation.service.js";

export const createConversationController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const conversation =
            await createConversation(
                userId,
                req.body
            );

        res.status(201).json({
            conversation,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create conversation",
        });
    }
};

export const getConversationsController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const conversations =
            await getUserConversations(userId);

        res.status(200).json({
            conversations,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to get conversations",
        });
    }
};