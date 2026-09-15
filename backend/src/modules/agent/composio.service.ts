import { composio } from "../../config/composio.js";

export const getComposioSession = async (userId: string) => {
    return composio.sessions.create(userId, {
        toolkits: ["googlesheets"],
    });
};

export const getUserTools = async (userId: string) => {
    const session = await getComposioSession(userId);

    const tools = await session.tools();

    return {
        session,
        tools,
    };
};

export const authorizeGoogleSheets = async (userId: string) => {
    const session = await composio.sessions.create(userId, {
        toolkits: ["googlesheets"],
    });

    const connection = await session.authorize("googlesheets");

    return connection.redirectUrl;
};