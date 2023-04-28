import { GraphQLError, GraphQLErrorOptions } from "graphql";

export abstract class InternalServerError extends GraphQLError {
  constructor(options?: GraphQLErrorOptions) {
    super("Internal Server Error", {
      ...options,
      extensions: {
        ...options?.extensions,
        code: "INTERNAL_SERVER_ERROR",
      },
    });
  }
}
