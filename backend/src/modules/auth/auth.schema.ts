import { z } from "zod";

export const signupSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(100),
        email: z.email(),
        password: z.string().min(4).max(100),
    }),
    params: z.object({}),
    query: z.object({}),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(4).max(100),
    }),
    params: z.object({}),
    query: z.object({}),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;