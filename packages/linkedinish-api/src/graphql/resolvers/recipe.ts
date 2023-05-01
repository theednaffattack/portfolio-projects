import {
  Resolver,
  Query,
  Mutation,
  Authorized,
  FieldResolver,
  Arg,
  Root,
} from "type-graphql";

import { RecipeType } from "../entities/recipe-type";
import { UserRolesEnum } from "../../types/all";
import { RecipeService } from "../../services/recipe-service";

@Resolver(RecipeType)
export class RecipeResolver {
  // dependency injection
  constructor(private recipeService: RecipeService) {}

  @Query((returns) => [RecipeType])
  recipes() {
    return this.recipeService.findAll();
  }

  @Mutation()
  @Authorized(UserRolesEnum.ADMIN) // auth guard
  async removeRecipe(@Arg("id") id: string) {
    return await this.recipeService.removeById(id);
  }

  @FieldResolver()
  averageRating(@Root() recipe: RecipeType) {
    return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
  }
}
