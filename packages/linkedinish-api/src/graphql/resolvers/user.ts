import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";

import { inject, injectable } from "tsyringe";
import { UserService } from "~/services/user-service";
import { UserRoles } from "../../types";
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
  recipes() {
    return this.userService.findAll();
  }

  @Mutation()
  @Authorized(UserRoles.ADMIN) // auth guard
  removeUser(@Arg("id") id: string): boolean {
    return this.userService.removeById(id);
  }
}
