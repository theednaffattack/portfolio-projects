import { mergeSchemas } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";
import { container } from "tsyringe";
import { buildSchemaSync } from "type-graphql";
import { authChecker } from "./auth-checker";
import { authDirective } from "./directives/auth-directive";
import { UserResolver } from "./resolvers/user";

// Directives
const directives = [authDirective] as const;

const schemaSimple = buildSchemaSync({
  resolvers: [UserResolver],
  container: { get: (cls) => container.resolve(cls) },
  authChecker,
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
