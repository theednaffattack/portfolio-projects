import { cleanEnv, host, makeValidator, port, str } from "envalid";
import fs from "node:fs";

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
  DATABASE_URL: str({ desc: "Database URL" }),
  TOKEN_PRIVATE_KEY: str({ default: "", desc: "Token private key" }), // fileValidator({ desc: "Token private key" }),
  TOKEN_PUBLIC_KEY: str({ default: "", desc: "Token public key" }), // fileValidator({ desc: "Token public key" }),
  TOKEN_PASSPHRASE: str({ default: "", desc: "Token passphrase" }),
});
