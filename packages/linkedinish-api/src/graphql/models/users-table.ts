import { InferModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username").notNull(),
  city: varchar("city").notNull(),
  country: varchar("country").notNull(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UsersModel = InferModel<typeof usersTable>;
export type NewUserModel = InferModel<typeof usersTable, "insert">;
