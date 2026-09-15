import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/index.js";
import { checkpointer } from "./modules/agent/agent.checkpointer.js";

const PORT = env.port;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ PostgreSQL connected");

        await checkpointer.setup();
        console.log("✅ LangGraph checkpointer ready");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ PostgreSQL connection failed:", error);
        process.exit(1);
    }
};

startServer();