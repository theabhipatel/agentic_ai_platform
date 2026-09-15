import { Composio } from "@composio/core";
import { LangchainProvider } from "@composio/langchain";
import { env } from "./env.js";

export const composio = new Composio({
    apiKey: env.composioApiKey,
    provider: new LangchainProvider(),
});