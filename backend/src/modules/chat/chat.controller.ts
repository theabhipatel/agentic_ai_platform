import type { Request, Response } from "express";

import { chat } from "./chat.service.js";

export const chatController = async (
    req: Request,
    res: Response
) => {
    try {
        const { message, threadId } = req.body;

        const userId = req.user!.userId;

        const response = await chat(
            userId,
            threadId,
            message
        );

        res.status(200).json({
            response,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Something went wrong",
        });
    }
};