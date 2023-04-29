import { GraphQLSchema } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { container } from "tsyringe";
import { RecipeResolver } from "./resolvers/all";
import { authDirective } from "./directives/auth-directive";

// Directives
const directives = [authDirective] as const;

const schemaSimple = buildSchemaSync({
  resolvers: [RecipeResolver],
  container: { get: (cls) => container.resolve(cls) },
  // FIXME forbidUnknownValues must be set to true
  validate: { forbidUnknownValues: false },
});

const schemaMerged = mergeSchemas({
  schemas: [schemaSimple],
  typeDefs: directives.map((directive) => directive.typeDefs),
});

export const schema: GraphQLSchema = directives.reduce(
  (newSchema, directive) => directive.transformer(newSchema),
  schemaMerged
);
