import * as path from "path";
import { buildSchema } from "type-graphql";
import type { GraphQLSchema } from "graphql";
import { fileURLToPath } from "node:url";

import { RecipeResolver } from "./recipe-resolver";
// import { asyncWrapper } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// build TypeGraphQL executable schema
let schema: GraphQLSchema;

try {
  schema = await buildSchema({
    resolvers: [RecipeResolver],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });
} catch (err) {
  console.error(err);
}

export { schema };
