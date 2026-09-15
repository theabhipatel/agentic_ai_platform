import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),

    DATABASE_URL: z.string().min(1),

    OPENROUTER_API_KEY: z.string().min(1),
    MODEL_NAME: z.string().min(1),

    COMPOSIO_API_KEY: z.string().min(1),

    JWT_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.log("❌ Invalid environment variables:");
    console.log(z.treeifyError(parsedEnv.error));
    process.exit(1);
}

export const env = {
    port: parsedEnv.data.PORT,
    databaseUrl: parsedEnv.data.DATABASE_URL,
    openRouterApiKey: parsedEnv.data.OPENROUTER_API_KEY,
    modelName: parsedEnv.data.MODEL_NAME,
    composioApiKey: parsedEnv.data.COMPOSIO_API_KEY,
    jwtSecret: parsedEnv.data.JWT_SECRET,
};