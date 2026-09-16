import type { Request, Response } from "express";

import {
    createConversation,
    deleteConversation,
    getConversationMessages,
    getUserConversation,
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

export const getConversationController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const conversationId = req.params.conversationId as string;

        const conversation = await getUserConversation(
            userId,
            conversationId
        );

        if (!conversation) {
            res.status(404).json({
                error: "Conversation not found",
            });
            return;
        }

        res.status(200).json({
            conversation,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to get conversation",
        });
    }
};

export const getConversationMessagesController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const conversationId =
            req.params.conversationId as string;

        const messages = await getConversationMessages(
            userId,
            conversationId
        );

        if (messages === null) {
            res.status(404).json({
                error: "Conversation not found",
            });
            return;
        }

        res.status(200).json({
            messages,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to get conversation messages",
        });
    }
};

export const deleteConversationController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const conversationId =
            req.params.conversationId as string;

        const deleted = await deleteConversation(
            userId,
            conversationId
        );

        if (!deleted) {
            res.status(404).json({
                error: "Conversation not found",
            });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete conversation",
        });
    }
};