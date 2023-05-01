import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";

import { inject, injectable } from "tsyringe";
import { UserService } from "~/services/user-service";
import { UserRolesEnum } from "../../types";
import { UserEntity } from "../entities/user-entity";

@Resolver(UserEntity)
@injectable()
export class UserResolver {
  // dependency injection
  public constructor(
    @inject(UserService)
    private readonly userService: UserService
  ) {}

  @Query((returns) => [UserEntity])
  users() {
    return this.userService.findAll();
  }

  @Mutation()
  @Authorized(UserRolesEnum.ADMIN) // auth guard
  removeUser(@Arg("id") id: string): boolean {
    return this.userService.removeById(id);
  }
}
