import type jwt from "jsonwebtoken";

import type { TokenTypesEnum } from "./token-types-enum";
import { NodePermissionEnum, NodeRoleEnum } from "./node-permission-enum";
import { UserPermissionsEnum, UserRolesEnum } from "./all";

type ITokenPayload<T extends TokenTypesEnum> = {
  type: T;
  id: string;
  roles: T extends TokenTypesEnum.USER
    ? UserRolesEnum[]
    : T extends TokenTypesEnum.NODE
    ? NodeRoleEnum[]
    : never;
  permissions: T extends TokenTypesEnum.USER
    ? UserPermissionsEnum[]
    : T extends TokenTypesEnum.NODE
    ? NodePermissionEnum[]
    : never;
};

export type UserTokenPayload = ITokenPayload<TokenTypesEnum.USER>;
export type NodeTokenPayload = ITokenPayload<TokenTypesEnum.NODE>;
export type TokenPayload = UserTokenPayload | NodeTokenPayload;

type IToken<T> = jwt.Jwt & { payload: T };
export type UserToken = IToken<UserTokenPayload>;
export type NodeToken = IToken<NodeTokenPayload>;
export type Token = UserToken | NodeToken;
