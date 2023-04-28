// import { ApolloServer } from "apollo-server";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";

import { fileURLToPath } from "node:url";
import * as path from "path";
import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./recipe-resolver";
// import { asyncWrapper } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config } from "./config";
import { handleWebServerListen } from "./handle-web-server-listen";
// import { schema } from "./shcema";

async function bootstrap() {
  // let schema;
  // try {
  //   const schema = await buildSchema({
  //     resolvers: [RecipeResolver],
  //     // automatically create `schema.gql` file with schema definition in current folder
  //     emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  //   });
  // } catch (err) {
  //   console.error(err);
  // }

  const app = express();
  const httpServer = http.createServer(app);

  // Create GraphQL server
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RecipeResolver],
      // automatically create `schema.gql` file with schema definition in current folder
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    }),

    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(cors(), express.json(), expressMiddleware(server));

  // Start the server
  // const { url } = await server.listen(config.env.PORT, config.ip.host);

  // console.log(`Server is running, GraphQL Playground available at ${url}`);

  // await new Promise((resolve) =>
  httpServer.listen({
    port: config.env.PORT,
    hostname: config.ip.host,
    handleWebServerListen,
  });
  //   resolve()
  // );
  console.log(`🚀 Server ready at http://localhost:4000`);
}

bootstrap().catch((err) => {
  console.error(err);
});
