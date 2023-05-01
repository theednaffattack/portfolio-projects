import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import pino from "pino";

import { config } from "./config";
import { logger } from "./logger";

export const pool = new Pool({
  //   connectionString: "postgres://user:password@host:port/db",
  connectionString: config.database.url,
});

pool.on("error", pgPoolError);

export const db = drizzle(pool, { logger });

function pgPoolError(err: unknown) {
  logger.error(err, "Pool error");
}
