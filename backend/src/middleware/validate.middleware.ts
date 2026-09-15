import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";


export const validate =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            if (!result.success) {
                res.status(400).json({
                    error: "Validation failed",
                    details: result.error.issues,
                });
                return;
            }

            next();
        };

