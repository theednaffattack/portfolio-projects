import { InferModel } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { roles } from "./roles";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username").notNull(),
  city: varchar("city").notNull(),
  country: varchar("country").notNull(),
  email: varchar("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UsersModel = InferModel<typeof users>;
export type NewUserModel = InferModel<typeof users, "insert">;

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey(),
  name: varchar("username", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  city: varchar("city", { length: 320 }).notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  postalCode: varchar("postal_code", { length: 12 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OrganizationsModel = InferModel<typeof organizations>;
