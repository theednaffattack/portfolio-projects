import fs from "node:fs";
import { host, port, str, url, cleanEnv, makeValidator } from "envalid";

const fileValidator = makeValidator((file) => {
  return fs.readFileSync(file, { encoding: "utf8", flag: "r" });
});

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production", "test"],
    default: "production",
    desc: "Node environment",
  }),
  HOST: host({ default: "0.0.0.0", desc: "Server host" }),
  PORT: port({ default: 80, desc: "Server port" }),
  LOGGER_LEVEL: str({
    choices: ["fatal", "error", "warn", "info", "debug", "trace", "silent"],
    default: "info",
    devDefault: "debug",
    desc: "Logger level",
  }),
  DATABASE_URL: url({ desc: "Database URL" }),
});
