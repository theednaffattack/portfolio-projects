import pino from "pino";

import { config } from "./config";

export const logger = pino({
  name: config.app.name,
  level: config.env.LOGGER_LEVEL,
});
