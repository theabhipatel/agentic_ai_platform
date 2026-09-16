import { and, desc, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { conversations } from "../../db/schema/conversations.js";

import type {
    CreateConversationInput,
} from "./conversation.schema.js";
import { createAgent } from "../agent/agent.service.js";
import type { BaseMessage } from "@langchain/core/messages";

export const createConversation = async (
    userId: string,
    data: CreateConversationInput
) => {
    const [conversation] = await db
        .insert(conversations)
        .values({
            userId,
            title: data.title ?? "New conversation",
        })
        .returning();

    return conversation;
};

export const getUserConversations = async (
    userId: string
) => {
    return db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.updatedAt));
};

export const getUserConversation = async (
    userId: string,
    conversationId: string
) => {
    const [conversation] = await db
        .select()
        .from(conversations)
        .where(
            and(
                eq(conversations.id, conversationId),
                eq(conversations.userId, userId)
            )
        )
        .limit(1);

    return conversation;
};

export const getConversationMessages = async (
    userId: string,
    conversationId: string
) => {
    // First verify that this conversation belongs to the user
    const conversation = await getUserConversation(
        userId,
        conversationId
    );

    if (!conversation) {
        return null;
    }

    // Create the same agent that uses the Postgres checkpointer
    const agent = await createAgent(userId);

    // Read the latest persisted LangGraph state
    const state = await agent.getState({
        configurable: {
            thread_id: conversationId,
        },
    });

    return state.values.messages
        .filter((message: BaseMessage) => {
            // Don't expose intermediate tool-call messages
            if (
                message.type === "ai" &&
                !message.content
            ) {
                return false;
            }

            // Don't expose raw tool results to the frontend
            if (message.type === "tool") {
                return false;
            }

            return true;
        })
        .map(serializeMessage);
};

const serializeMessage = (message: BaseMessage) => {
    let role: "user" | "assistant" | "tool";

    switch (message.type) {
        case "human":
            role = "user";
            break;

        case "ai":
            role = "assistant";
            break;

        case "tool":
            role = "tool";
            break;

        default:
            role = "tool";
    }

    return {
        id: message.id,
        role,
        content: message.content,
    };
};