import { drizzle } from "drizzle-orm/node-postgres";
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, eq, sql } from "drizzle-orm";
import { Pool } from "pg";

import { RecipeType } from "../graphql/entities/recipe-type";
import { createRecipeSamples } from "./recipe-samples";
import { users } from "../graphql/models/user";

const pool = new Pool({
  connectionString: "postgres://user:password@host:port/db",
});

const db = drizzle(pool);

export class UserService {
  private readonly items: RecipeType[] = createRecipeSamples();
  public create() {}
  public async findAll() {
    const allUsers = await db.select().from(users);
    return allUsers;
  }
  public remove() {}
  public update() {}
  public findUnique() {}
  public findUniqueOrThrow() {}
  public async removeById(id: string) {
    const allUsers = await db.select().from(users).where(eq(users.id, id));
    return true;
  }
  public signIn() {}
}
