import { StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph";
import { llm } from "./config/llm.js";
import {
    ToolNode,
    toolsCondition
} from "@langchain/langgraph/prebuilt";
import { composio } from "./config/composio.js";
import { MemorySaver } from "@langchain/langgraph-checkpoint";

const session = await composio.sessions.create("user_123", {
    toolkits: ["googlesheets"],
});

const tools = await session.tools();
const llmWithTools = llm.bindTools(tools);

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llmWithTools.invoke(state.messages);

    return {
        messages: [response]
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
export const agent = graph.compile({ checkpointer });