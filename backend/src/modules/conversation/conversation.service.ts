import { and, desc, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { conversations } from "../../db/schema/conversations.js";

import type {
    CreateConversationInput,
} from "./conversation.schema.js";

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