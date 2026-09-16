import { z } from "zod";

export const createConversationSchema = z.object({
    body: z.object({
        title: z.string().max(255).optional(),
    }),

    params: z.object({}),

    query: z.object({}),
});

export const conversationIdSchema = z.object({
    body: z.object({}),

    params: z.object({
        conversationId: z.uuid(),
    }),

    query: z.object({}),
});

export type CreateConversationInput =
    z.infer<typeof createConversationSchema>["body"];