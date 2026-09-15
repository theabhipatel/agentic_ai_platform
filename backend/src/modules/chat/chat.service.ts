import { HumanMessage } from "@langchain/core/messages";

import { createAgent } from "../agent/agent.service.js";

export const chat = async (
    userId: string,
    threadId: string,
    message: string
) => {
    const agent = await createAgent(userId);

    const response = await agent.invoke(
        {
            messages: [
                new HumanMessage(message),
            ],
        },
        {
            configurable: {
                thread_id: threadId,
            },
        }
    );

    return response.messages.at(-1)?.content;
};