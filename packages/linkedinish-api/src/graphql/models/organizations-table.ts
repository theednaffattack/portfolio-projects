import { InferModel } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const organizationsTable = pgTable("organizations", {
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

export type OrganizationsModel = InferModel<typeof organizationsTable>;
