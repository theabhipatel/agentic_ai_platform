import { z } from "zod";

export const chatSchema = z.object({
    body: z.object({
        message: z.string().min(1),
        conversationId: z.uuid(),
    }),

    params: z.object({}),

    query: z.object({}),
});