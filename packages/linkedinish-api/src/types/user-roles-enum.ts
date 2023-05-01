import { registerEnumType } from "type-graphql";

export enum UserRolesEnum {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
  SIMPLE = "SIMPLE",
}

export enum UserPermissionsEnum {
  READ = "READ",
  WRITE = "WRITE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

registerEnumType(UserRolesEnum, {
  name: "UserRolesEnum", // this one is mandatory
  description: "The different User roles for the app.", // this one is optional
});

registerEnumType(UserPermissionsEnum, {
  name: "UserPermissionsEnum",
  description: "The different User permissions for the app.",
});
