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
import { usersTable } from "~/graphql/models/users-table";

const pool = new Pool({
  connectionString: "postgres://user:password@host:port/db",
});

const db = drizzle(pool);

export class RecipeService {
  private readonly items: RecipeType[] = createRecipeSamples();
  public create() {}
  public async findAll() {
    const allUsers = await db.select().from(usersTable);
    return allUsers;
  }
  public remove() {}
  public update() {}
  public findUnique() {}
  public findUniqueOrThrow() {}
  public async removeById(id: string) {
    const allUsers = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return true;
  }
  public signIn() {}
}

export class UserService {
  public create() {}
  public remove() {}
  public update() {}
  public findUnique() {}
  public findUniqueOrThrow() {}
  public signIn() {}
}
