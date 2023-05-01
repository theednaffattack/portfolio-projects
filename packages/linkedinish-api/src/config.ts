import convert from "convert";
import type pino from "pino";
import { address } from "ip";

import type { Config } from "./types";
import { env } from "./env";

const ipAddress = address();

export const config: Config = {
  app: "LinkedInish",
  node: {
    env: env.NODE_ENV,
  },
  server: {
    host: ipAddress, // env.HOST,
    port: env.PORT,
  },
  logger: {
    level: env.LOGGER_LEVEL as pino.LevelWithSilent,
  },
  database: {
    url: env.DATABASE_URL,
  },
  // ssh: {
  //   username: env.SSH_USERNAME,
  //   passphrase: env.SSH_PASSPHRASE,
  //   privateKey: env.SSH_PRIVATE_KEY,
  // },
  token: {
    algorithm: "RS256",
    expiration: convert(365, "d").to("s"),
    passphrase: env.TOKEN_PASSPHRASE,
    privateKey: env.TOKEN_PRIVATE_KEY,
    publicKey: env.TOKEN_PUBLIC_KEY,
  },
  graphql: { path: "/graphql" },
  user: {
    username: { validation: { maxLength: 64 } },
    password: {
      validation: {
        minLength: 8,
        maxLength: 32,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      },
    },
  },
};
