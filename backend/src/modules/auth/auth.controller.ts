import type { Request, Response } from "express";

import {
    login,
    signup,
} from "./auth.service.js";

export const signupController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await signup(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Signup failed",
        });
    }
};

export const loginController = async (
    req: Request,
    res: Response
) => {
    try {
        const result = await login(req.body);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(401).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Login failed",
        });
    }
};