export type UserCreateInput = {
  id?: string;
  username: string;
  password: string;
  roles?: UserCreaterolesInput | Enumerable<UserRoleEnum>;
  permissions?: UserCreatepermissionsInput | Enumerable<UserPermissionEnum>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};
