import { AuthChecker } from "type-graphql";

import { ContextType } from "../types/all";

export const authChecker: AuthChecker<ContextType> = (
  { root, args, context, info },
  roles
) => {
  // here you can read user from context
  // and check his permission in db against `roles` argument
  // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]

  return true; // or false if access denied
};
