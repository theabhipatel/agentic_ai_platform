import { db } from "./index.js";

const result = await db.execute("SELECT NOW()");

console.log("Database connected:", result.rows[0]); 