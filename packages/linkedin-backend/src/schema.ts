import { GraphQLSchema } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { mergeSchemas } from "@graphql-tools/schema";
import { container } from "tsyringe";
import {
  //   CpuNodeResolver,
  //   CpuResolver,
  //   StorageNodeResolver,
  //   StorageResolver,
  //   InterfaceNodeResolver,
  //   InterfaceResolver,
  //   NodeCpuResolver,
  //   NodeStorageResolver,
  //   NodeInterfaceResolver,
  //   NodeNodePoolResolver,
  //   NodeStatusResolver,
  //   NodeResolver,
  //   NodePoolNodeResolver,
  //   NodePoolResolver,
  //   StatusNodeResolver,
  //   StatusResolver,
  UserResolver,
} from "./resolvers/main";
import { authDirective } from "./directives";

// Directives
const directives = [authDirective] as const;

const schemaSimple = buildSchemaSync({
  resolvers: [
    // CpuResolver,
    // CpuNodeResolver,
    // StorageResolver,
    // StorageNodeResolver,
    // InterfaceResolver,
    // InterfaceNodeResolver,
    // NodeResolver,
    // NodeCpuResolver,
    // NodeStorageResolver,
    // NodeInterfaceResolver,
    // NodeNodePoolResolver,
    // NodeStatusResolver,
    // NodePoolResolver,
    // NodePoolNodeResolver,
    // StatusResolver,
    // StatusNodeResolver,
    UserResolver,
  ],
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
