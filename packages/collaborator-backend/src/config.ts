import { z as zod } from "zod";
import { internalIpV4Sync } from "internal-ip";
import { config as envConfig } from "dotenv";

// Get access to our env variables
envConfig();

const envSchema = zod.object({
  PORT: zod.coerce.number().min(1000),
  WS_PORT: zod.coerce.number().min(443).max(443),
});

const ipSchema = zod.object({
  host: zod.string().nonempty(),
});

const socketSettingsSchema = zod.object({
  path: zod.string().nonempty(),
});

const clientEnv = {
  WS_PORT: process.env.WS_PORT,
  PORT: process.env.PORT,
};

const ipVars = {
  host: internalIpV4Sync(),
};

const socketSettingsOpts = {
  path: "/playground/0/playground",
};

const env = envSchema.parse(clientEnv);
const ip = ipSchema.parse(ipVars);
const socket = socketSettingsSchema.parse(socketSettingsOpts);

export const config = { env, ip, socket };
