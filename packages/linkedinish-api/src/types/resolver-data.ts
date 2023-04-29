import type { GraphQLResolveInfo } from "graphql";

/**
 * Resolver data.
 */
export type ResolverData<TContext = Record<string, never>> = {
  root: unknown;
  args: { [arg: string]: unknown };
  context: TContext;
  info: GraphQLResolveInfo;
};
