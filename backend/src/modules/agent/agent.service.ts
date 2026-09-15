import {
    StateGraph,
    START,
    MessagesAnnotation,
} from "@langchain/langgraph";

import {
    ToolNode,
    toolsCondition,
} from "@langchain/langgraph/prebuilt";

import { MemorySaver } from "@langchain/langgraph-checkpoint";

import { llm } from "../../config/llm.js";
import { getUserTools } from "./composio.service.js";


export const createAgent = async (userId: string) => {
    const { tools } = await getUserTools(userId);

    const llmWithTools = llm.bindTools(tools);

    const callModel = async (
        state: typeof MessagesAnnotation.State
    ) => {
        const response = await llmWithTools.invoke(
            state.messages
        );

        return {
            messages: [response],
        };
    };

    const toolNode = new ToolNode(tools);

    const graph = new StateGraph(MessagesAnnotation)
        .addNode("model", callModel)
        .addNode("tools", toolNode)
        .addEdge(START, "model")
        .addConditionalEdges("model", toolsCondition)
        .addEdge("tools", "model");

    const checkpointer = new MemorySaver();

    return graph.compile({
        checkpointer,
    });
};