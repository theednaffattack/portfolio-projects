import pg from "pg";

import { config } from "./config";
import { logger } from "./logger";

const pool = new pg.Pool({ connectionString: config.database.url });
pool.on("error", pgPoolError); // don't let a pg restart kill your app

function pgPoolError(err: Error) {
  logger.error(err);
}

export { pool };
