import { InferModel } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { rolesTable } from "./roles-table";
import { usersTable } from "./users-table";

export const usersRolesTable = pgTable("users_roles", {
  id: uuid("id"),
  userId: uuid("user_id").references(() => usersTable.id),
  roleId: uuid("role_id").references(() => rolesTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type UsersRolesModel = InferModel<typeof usersRolesTable>;
