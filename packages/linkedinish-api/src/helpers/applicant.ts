import { createParamDecorator } from "type-graphql";
import type { ContextType } from "../types/all";
import type { TokenTypes } from "../types/token-types-enum";
import { AuthenticationError, AuthorizationError } from "../errors/all";

type ApplicantArgs = {
  type?: TokenTypes;
};

export function Applicant(args?: ApplicantArgs): ParameterDecorator {
  return createParamDecorator<ContextType>(({ context }) => {
    if (!context.applicant) throw new AuthenticationError();
    if (args?.type && args?.type !== context.applicant.type)
      throw new AuthorizationError();

    return context.applicant;
  });
}
