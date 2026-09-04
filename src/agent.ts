import { StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph";
import { llm } from "./config/llm.js";

const callModel = async (state: typeof MessagesAnnotation.State) => {
    const response = await llm.invoke(state.messages);

    return {
        messages: [response]
    };
};

const graph = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

export const agent = graph.compile();