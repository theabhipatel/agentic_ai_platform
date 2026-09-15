import type { Request, Response } from "express";

import {
    authorizeGoogleSheets,
} from "./composio.service.js";

export const googleSheetsAuthController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const redirectUrl =
            await authorizeGoogleSheets(userId);

        res.json({
            requiresAuth: true,
            redirectUrl,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to authorize Google Sheets",
        });
    }
};