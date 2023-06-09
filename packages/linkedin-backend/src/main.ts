/* ! Always on top ! */
import "reflect-metadata";
import "json-bigint-patch";
import "dotenv/config";
/*  */
import { container } from "tsyringe";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import rateLimit from "@fastify/rate-limit";
import healthCheck from "fastify-healthcheck";

import { logger } from "./logger";
import { context, formatError } from "./helpers";
import { config } from "./config";
import { createRecipeSamples } from "./recipe-samples";
import { schema } from "./schema";
import { Context } from "./types";

// Set timezone to UTC
process.env.TZ = "Etc/UTC";

import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
import { ApolloServer } from "@apollo/server";

// Server
const server = Fastify();
// Apollo
const apollo = new ApolloServer<Context>({
  schema,
  formatError,
  plugins: [fastifyApolloDrainPlugin(server)],
});

async function main() {
  // Database
  // await prisma.$connect();
  logger.info(`Database connected`);

  //   // K8s
  //   kubeconfig.loadFromDefault();
  //   await container.resolve(NodeInformer).start();
  //   logger.info("K8s configured");

  // Apollo
  await apollo.start();
  logger.info("Apollo server started");

  // Server
  await server.register(rateLimit);
  await server.register(helmet, {
    crossOriginEmbedderPolicy: config.env.NODE_ENV !== "development",
    contentSecurityPolicy: config.env.NODE_ENV !== "development",
  });
  await server.register(cors);
  await server.register(compress);
  await server.register(healthCheck);
  await server.register(fastifyApollo(apollo), {
    path: config.app.graphqlPath, //config.graphql.path,
    context,
  });
  const url = await server.listen({
    port: config.env.PORT,
    host: config.ip.host,
  });
  logger.info(`Server started at ${url}`);
}

async function terminate(signal: NodeJS.Signals) {
  logger.warn(`Received '${signal}' signal`);

  // Container
  await container.dispose();
  // Database
  // await prisma.$disconnect();
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
