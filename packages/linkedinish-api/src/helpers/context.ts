import { container } from "tsyringe";
import type { ApolloFastifyContextFunction } from "@as-integrations/fastify";
import type { ContextType, TokenPayload } from "../types/all";
import { TokenService } from "../services/token-service";
import { AuthenticationError } from "../errors/authentication-error";

export const context: ApolloFastifyContextFunction<ContextType> = async ({
  ip,
  headers,
}): Promise<ContextType> => {
  let applicant: TokenPayload | undefined;
  const authorizationHeader =
    headers && "Authorization" in headers ? "Authorization" : "authorization";

  if (headers && headers[authorizationHeader]) {
    const parts = (headers[authorizationHeader] as string).split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        const token = credentials;
        const tokenService = container.resolve(TokenService);

        try {
          const decodedToken = await tokenService.verify(token);
          applicant = decodedToken.payload;
        } catch (error) {
          throw new AuthenticationError(
            error instanceof Error ? error.message : `${error}`
          );
        }
      }
    } else {
      throw new AuthenticationError(
        "Token format is 'Authorization: Bearer [token]'"
      );
    }
  }

  return { ip, applicant };
};
