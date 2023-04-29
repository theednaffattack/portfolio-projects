import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const rolesTable = pgTable("roles", {
  id: uuid("id"),
  roleName: varchar("role_name"),
  roleDescription: varchar("role_description"),
});

export type RolesModel = InferModel<typeof rolesTable>;
