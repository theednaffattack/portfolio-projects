import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const permissionsTable = pgTable("permissions", {
  id: uuid("id").primaryKey(),
  permissionName: varchar("permission_name").notNull(),
  permissionKey: varchar("permission_key").notNull(),
});

export type PermissionsModel = InferModel<typeof permissionsTable>;
