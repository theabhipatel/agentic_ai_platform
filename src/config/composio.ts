import { Composio } from "@composio/core";
import { LangchainProvider } from "@composio/langchain";

export const composio = new Composio({
    apiKey: process.env.COMPOSIO_API_KEY ?? null,
    provider: new LangchainProvider(),
});