import { InferModel } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { users } from "./user";

export const usersRoles = pgTable("users_roles", {
  id: uuid("id"),
  userId: uuid("user_id").references(() => users.id),
  roleId: uuid("role_id").references(() => roles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export type UsersRolesModel = InferModel<typeof usersRoles>;
