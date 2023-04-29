import { InferModel } from "drizzle-orm";
import { pgTable, uuid, foreignKey, timestamp } from "drizzle-orm/pg-core";
import { permission } from "./permission";
import { users } from "./user";

export const usersPermissions = pgTable(
  "user_permission",
  {
    permissionsId: uuid("permissions_id").references(() => permission.id),
    usersId: uuid("users_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (userPermission) => {
    return {
      permissionIdFk: foreignKey({
        columns: [userPermission.permissionsId],
        foreignColumns: [permission.id],
      }),
      userIdFk: foreignKey({
        columns: [userPermission.usersId],
        foreignColumns: [users.id],
      }),
    };
  }
);

export type UsersPermissionsModel = InferModel<typeof usersPermissions>;
