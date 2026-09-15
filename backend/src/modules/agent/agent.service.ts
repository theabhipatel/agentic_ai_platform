import {
    StateGraph,
    START,
    MessagesAnnotation,
} from "@langchain/langgraph";

import {
    ToolNode,
    toolsCondition,
} from "@langchain/langgraph/prebuilt";

import { llm } from "../../config/llm.js";
import { getUserTools } from "./composio.service.js";
import { checkpointer } from "./agent.checkpointer.js";


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


    return graph.compile({
        checkpointer,
    });
};