import { InferModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username").notNull(),
  city: varchar("city"),
  country: varchar("country"),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UsersModel = InferModel<typeof usersTable>;
export type NewUsersModel = InferModel<typeof usersTable, "insert">;
