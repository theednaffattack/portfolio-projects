import { inject, injectable } from "tsyringe";
import { logger } from "../logger";
import { AuthenticationError } from "../errors/authentication-error";
import { TokenService } from "./token-service";
import { CryptoService } from "./crypto-service";
import { usersTable } from "../graphql/models/users-table";
import type { UsersModel, NewUsersModel } from "../graphql/models/users-table";
import type { TokenTypes } from "../types/all";
import { db } from "../db";

// type CreateArgs = Omit<Prisma.UserCreateArgs, "include" | "data"> & {
//   data: CreateUserInput;
// };

// type FindManyArgs = Omit<Prisma.UserFindManyArgs, "include" | "cursor"> & {
//   cursor?: string;
// };

// type FindUniqueArgs = Omit<Prisma.UserFindUniqueArgs, "include">;

// type FindUniqueOrThrowArgs = Omit<Prisma.UserFindUniqueOrThrowArgs, "include">;

// type UpdateArgs = Omit<Prisma.UserUpdateArgs, "include" | "where" | "data"> & {
//   where: WithRequired<Pick<Prisma.UserWhereUniqueInput, "id">, "id">;
//   data: UpdateUserInput;
// };

// type SignInArgs = Required<Pick<PrismaUser, "username" | "password">>;

type CreateArgs = Omit<UsersModel, "id" | "createdAt" | "updatedAt">;
type CustomUsersModel = Omit<NewUsersModel, "id">;

@injectable()
export class UserService {
  public constructor(
    @inject(TokenService) private readonly tokenService: TokenService,
    @inject(CryptoService) private readonly cryptoService: CryptoService
  ) {}

  public async create(args: CreateArgs) {
    const newUser: CustomUsersModel = {
      city: "Benicia",
      country: "USA",
      email: "fake@fake.com",
      username: "Eddie_fake",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(usersTable).values(newUser);
  }

  public async findAll() {
    return [
      {
        city: "Benicia",
        country: "USA",
        email: "fake@fake.com",
        username: "Eddie_fake",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city: "Benicia",
        country: "USA",
        email: "other@fake.com",
        username: "Other_fake",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  public createOld(args: CreateArgs, prismaTxn?: Prisma.TransactionClient) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fn = async (prisma: Prisma.TransactionClient) => {
      logger.info(`User service create: ${JSON.stringify(args)}`);

      // Extract data
      const { data } = args;

      // Update data
      data.password = await this.cryptoService.hash(data.password);

      // Write data
      // eslint-disable-next-line no-param-reassign
      args.data = data;

      return prisma.user.create(args);
    };

    return prismaTxn ? fn(prismaTxn) : prisma.$transaction(fn);
  }

  public async findAllOld() {
    const allUsers = await db.select().from(users);
  }

  public findManyOld(
    args: FindManyArgs,
    prismaTxn: Prisma.TransactionClient = prisma
  ) {
    logger.debug(`User service find many: ${JSON.stringify(args)}`);

    return prismaTxn.user.findMany({
      ...args,
      cursor: args.cursor ? { id: args.cursor } : undefined,
    });
  }

  public findUniqueOld(
    args: FindUniqueArgs,
    prismaTxn: Prisma.TransactionClient = prisma
  ) {
    logger.debug(`User service find unique: ${JSON.stringify(args)}`);

    return prismaTxn.user.findUnique(args);
  }

  public findUniqueOrThrowOld(
    args: FindUniqueOrThrowArgs,
    prismaTxn: Prisma.TransactionClient = prisma
  ) {
    logger.debug(`User service find unique or throw: ${JSON.stringify(args)}`);

    return prismaTxn.user.findUniqueOrThrow(args);
  }

  public updateOld(args: UpdateArgs, prismaTxn?: Prisma.TransactionClient) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fn = async (prisma: Prisma.TransactionClient) => {
      logger.info(`User service update: ${JSON.stringify(args)}`);

      // Extract data
      const { data } = args;

      // Update data
      if (data.password) {
        data.password = await this.cryptoService.hash(data.password);
      }

      // Write data
      // eslint-disable-next-line no-param-reassign
      args.data = data;

      return prisma.user.update(args);
    };

    return prismaTxn ? fn(prismaTxn) : prisma.$transaction(fn);
  }

  public removeById(id: string) {
    return true;
  }

  public signInOld(args: SignInArgs, prismaTxn?: Prisma.TransactionClient) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fn = async (prisma: Prisma.TransactionClient) => {
      logger.info(`User service sign in: ${args.username}`);

      const user = await this.findUnique(
        {
          select: { id: true, roles: true, permissions: true, password: true },
          where: { username: args.username },
        },
        prisma
      );

      // Check password
      if (
        !user ||
        !(await this.cryptoService.compare(args.password, user.password))
      ) {
        throw new AuthenticationError("Username or password is incorrect");
      }

      // Generate token
      return this.tokenService.sign({
        type: TokenTypes.USER,
        id: user.id,
        roles: user.roles,
        permissions: user.permissions,
      });
    };

    return prismaTxn ? fn(prismaTxn) : prisma.$transaction(fn);
  }
}
