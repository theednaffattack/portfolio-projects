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
import { UserRoles } from "../../types";
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
  @Authorized(UserRoles.ADMIN) // auth guard
  removeRecipe(@Arg("id") id: string): boolean {
    return this.recipeService.removeById(id);
  }

  @FieldResolver()
  averageRating(@Root() recipe: RecipeType) {
    return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
  }
}
