import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar, foreignKey } from "drizzle-orm/pg-core";
import { users } from "./user";

export const permission = pgTable("permission", {
  id: uuid("id").primaryKey(),
  permissionName: varchar("permission_name").notNull(),
  permissionKey: varchar("permission_key").notNull(),
});

export type PermissionModel = InferModel<typeof permission>;
