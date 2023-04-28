import type jwt from "jsonwebtoken";
import type {
  TokenTypes,
  UserRoleEnum,
  UserPermissionEnum,
  NodePermissionEnum,
  NodeRoleEnum,
} from "./types";

type ITokenPayload<T extends TokenTypes> = {
  type: T;
  id: string;
  roles: T extends TokenTypes.USER
    ? UserRoleEnum[]
    : T extends TokenTypes.NODE
    ? NodeRoleEnum[]
    : never;
  permissions: T extends TokenTypes.USER
    ? UserPermissionEnum[]
    : T extends TokenTypes.NODE
    ? NodePermissionEnum[]
    : never;
};
export type UserTokenPayload = ITokenPayload<TokenTypes.USER>;
export type NodeTokenPayload = ITokenPayload<TokenTypes.NODE>;
export type TokenPayload = UserTokenPayload | NodeTokenPayload;

type IToken<T> = jwt.Jwt & { payload: T };
export type UserToken = IToken<UserTokenPayload>;
export type NodeToken = IToken<NodeTokenPayload>;
export type Token = UserToken | NodeToken;
