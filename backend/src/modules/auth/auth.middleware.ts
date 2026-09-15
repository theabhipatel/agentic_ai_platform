import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Authentication required",
        });
        return;
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            env.jwtSecret
        ) as JwtPayload;

        req.user = {
            userId: decoded.userId,
        };

        next();
    } catch {
        res.status(401).json({
            error: "Invalid or expired token",
        });
    }
};