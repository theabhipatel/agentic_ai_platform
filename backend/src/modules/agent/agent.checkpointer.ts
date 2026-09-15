import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

import { pool } from "../../db/index.js";

export const checkpointer = new PostgresSaver(pool);