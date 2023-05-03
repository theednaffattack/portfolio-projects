/* ! Always on top ! */
import "dotenv/config";
import "json-bigint-patch";
import "reflect-metadata";
/*  */
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import compress from "@fastify/compress";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import healthCheck from "fastify-healthcheck";
import { Pool } from "pg";
import { container } from "tsyringe";

import { config } from "./config";
import { schema } from "./graphql/schema";
import { context } from "./helpers/context";
import { formatError } from "./helpers/format-error";
import { logger } from "./logger";
import { ContextType } from "./types/all";
import { pool } from "./pg-pool";

// Set timezone to UTC
process.env.TZ = "Etc/UTC";

// Server
const server = Fastify();
// Apollo
const apollo = new ApolloServer<ContextType>({
  formatError,
  plugins: [fastifyApolloDrainPlugin(server)],
  schema,
});

async function main() {
  // Database
  const client = await pool.connect();

  logger.info("Database connected");

  // Apollo
  await apollo.start();
  logger.info("Apollo server started");

  // Server
  await server.register(rateLimit);
  await server.register(helmet, {
    crossOriginEmbedderPolicy: config.node.env !== "development",
    contentSecurityPolicy: config.node.env !== "development",
  });
  await server.register(cors);
  await server.register(compress);
  await server.register(healthCheck);
  await server.register(fastifyApollo(apollo), {
    path: config.graphql.path,
    context,
  });
  const url = await server.listen({
    port: config.server.port,
    host: config.server.host,
  });
  logger.info(`Server started at ${url}${config.graphql.path}`);
}

async function terminate(signal: NodeJS.Signals) {
  logger.warn(`Received '${signal}' signal`);

  // Container
  await container.dispose();
  // Database
  //   await prisma.$disconnect();
  // Apollo
  await apollo.stop();
  // Server
  await server.close();
}

process.on("SIGTERM", terminate);
process.on("SIGINT", terminate);

main().catch((error) => {
  logger.fatal(error instanceof Error ? error.message : error);
  throw error;
});
