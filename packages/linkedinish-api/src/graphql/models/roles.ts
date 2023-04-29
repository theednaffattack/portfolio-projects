import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: uuid("id"),
  roleName: varchar("role_name"),
});

export type RolesModel = InferModel<typeof roles>;
