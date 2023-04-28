import { z as zod } from "zod";
import { internalIpV4Sync } from "internal-ip";
import { config as envConfig } from "dotenv";

// Get access to our env variables
envConfig();

const envSchema = zod.object({
  NODE_ENV: zod
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: zod.coerce.number().min(1000).max(9999),
  WS_PORT: zod.coerce.number().min(443).max(443),
  LOGGER_LEVEL: zod.union([
    zod.literal("fatal"),
    zod.literal("error"),
    zod.literal("warn"),
    zod.literal("info"),
    zod.literal("debug"),
    zod.literal("trace"),
    zod.literal("silent"),
  ]),
  DATABASE_URL: zod.string().url(),
});

const ipSchema = zod.object({
  host: zod.string().nonempty(),
});

const socketSettingsSchema = zod.object({
  path: zod.string().nonempty(),
});

const appSchema = zod.object({
  name: zod.string(),
  graphqlPath: zod.string(),
});

const clientEnv = {
  WS_PORT: process.env.WS_PORT,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOGGER_LEVEL: process.env.LOGGER_LEVEL,
};

const ipVars = {
  host: internalIpV4Sync(),
};

const socketSettingsOpts = {
  path: "/playground/0/playground",
};

const env = envSchema.parse(clientEnv);
const app = appSchema.parse({ name: "LinkedInish", graphqlPath: "/graphql" });
const ip = ipSchema.parse(ipVars);
const socket = socketSettingsSchema.parse(socketSettingsOpts);

export const getEnvIssues = (): zod.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
};

export const config = { app, env, ip, socket };
