import { InferModel } from "drizzle-orm";
import { pgTable, uuid, foreignKey, timestamp } from "drizzle-orm/pg-core";
import { permissionsTable } from "./permissions-table";
import { usersTable } from "./users-table";

export const usersPermissionsTable = pgTable(
  "users_permissions",
  {
    permissionsId: uuid("permissions_id").references(() => permissionsTable.id),
    usersId: uuid("users_id").references(() => usersTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (userPermission) => {
    return {
      permissionIdFk: foreignKey({
        columns: [userPermission.permissionsId],
        foreignColumns: [permissionsTable.id],
      }),
      userIdFk: foreignKey({
        columns: [userPermission.usersId],
        foreignColumns: [usersTable.id],
      }),
    };
  }
);

export type UsersPermissionsModel = InferModel<typeof usersPermissionsTable>;
