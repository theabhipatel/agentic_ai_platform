import type { Request, Response } from "express";

import {
    authorizeGoogleSheets,
    getGoogleSheetsStatus,
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



export const googleSheetsStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = req.user!.userId;

        const status =
            await getGoogleSheetsStatus(userId);

        res.status(200).json(status);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to check Google Sheets status",
        });
    }
};