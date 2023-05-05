import { inject, injectable } from "tsyringe";
import { logger } from "../logger";
import { AuthenticationError } from "../errors/authentication-error";
import { TokenService } from "./token-service";
import { CryptoService } from "./crypto-service";
import { TokenTypesEnum } from "../types/all";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";
import { pool } from "~/pg-pool";

type CreateArgs = s.users.Insertable;
type SignInArgs = Omit<CreateArgs, "created_at" | "updated_at" | "id">;

@injectable()
export class UserService {
  public constructor(
    @inject(TokenService) private readonly tokenService: TokenService,
    @inject(CryptoService) private readonly cryptoService: CryptoService
  ) {}

  public async create(args: CreateArgs) {
    const newUser: CreateArgs = {
      email: "fake@fake.com",
      username: "Eddie_fake",
      password: "skdjfiwer393wlkdf",
      created_at: new Date(),
      updated_at: new Date(),
    };
    return await db.insert("users", args).run(pool);
  }

  public async createMany(args: CreateArgs) {
    return await db.insert("users", [args]).run(pool);
  }

  public async findAll() {
    return await db.sql<s.users.SQL, s.users.Selectable[]>`
SELECT * FROM ${"users"}`.run(pool);
  }

  public async findOne(id: string) {
    return await db.select("users", { id }).run(pool);
  }

  public async removeById(id: string) {
    return await db.deletes("users", { id }).run(pool);
  }

  public async signIn(args: SignInArgs) {
    const user = await db
      .selectOne("users", {
        email: args.email,
        password: args.password,
        username: args.username,
      })
      .run(pool);

    if (user) {
      console.log("RETRIEVED USER", user);
    } else {
      console.log("NO RESULTS???");
    }

    // Check password
    if (
      !user ||
      !(await this.cryptoService.compare(args.password, user.password))
    ) {
      throw new AuthenticationError("Username or password is incorrect");
    }

    // Generate token
    return this.tokenService.sign({
      type: TokenTypesEnum.USER,
      id: user.id,
      roles: user.roles,
      permissions: user.permissions,
    });

    return true;
  }
}
