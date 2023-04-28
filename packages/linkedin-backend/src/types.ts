import type { GraphQLResolveInfo } from "graphql";

import type { TokenPayload } from "./token";

export type Context = {
  ip: string;
  applicant?: TokenPayload;
};

export enum TokenTypes {
  USER = "USER",
  NODE = "NODE",
}

export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserPermissionEnum {}
export enum NodeRoleEnum {}
export enum NodePermissionEnum {}

export type AuthData = {
  type: string;
  roles: string[];
  permissions: string[];
};

/**
 * Resolver data.
 */
export type ResolverData<TContext = Record<string, never>> = {
  root: unknown;
  args: { [arg: string]: unknown };
  context: TContext;
  info: GraphQLResolveInfo;
};

/**
 * Class type.
 */
export type ClassType<T = unknown> = {
  new (...args: unknown[]): T;
};
