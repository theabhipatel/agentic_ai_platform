import { HumanMessage } from "@langchain/core/messages";

import { createAgent } from "../agent/agent.service.js";
import { getUserConversation } from "../conversation/conversation.service.js";

export const chat = async (
    userId: string,
    conversationId: string,
    message: string
) => {
    const conversation =
        await getUserConversation(
            userId,
            conversationId
        );

    if (!conversation) {
        throw new Error(
            "Conversation not found"
        );
    }


    const agent = await createAgent(userId);

    const response = await agent.invoke(
        {
            messages: [
                new HumanMessage(message),
            ],
        },
        {
            configurable: {
                thread_id: conversation.id,
            },
        }
    );

    return response.messages.at(-1)?.content;
};