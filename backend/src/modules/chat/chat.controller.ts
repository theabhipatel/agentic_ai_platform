import type { Request, Response } from "express";

import { chat } from "./chat.service.js";

export const chatController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;
        const { message, conversationId } = req.body;

        const response = await chat(
            userId,
            conversationId,
            message
        );

        res.status(200).json({
            response,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Conversation not found"
        ) {
            res.status(404).json({
                error: error.message,
            });

            return;
        }


        res.status(500).json({
            error: "Something went wrong",
        });
    }
};