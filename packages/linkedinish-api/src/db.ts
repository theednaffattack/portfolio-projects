import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { config } from "./config";

const pool = new Pool({
  //   connectionString: "postgres://user:password@host:port/db",
  connectionString: config.database.url,
});

export const db = drizzle(pool);
