import { RecipeType } from "../graphql/entities/recipe-type";

export function createRecipeSamples() {
  return [
    createRecipe({
      description: "Desc 1",
      title: "Recipe 1",
      ratings: [0, 3, 1],
      createdAt: new Date("2018-04-11"),
      updatedAt: new Date("2018-04-11"),
    }),
    createRecipe({
      description: "Desc 2",
      title: "Recipe 2",
      ratings: [4, 2, 3, 1],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    createRecipe({
      description: "Desc 3",
      title: "Recipe 3",
      ratings: [5, 4],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];
}

function createRecipe(recipeData: Partial<RecipeType>) {
  return Object.assign(new RecipeType(), recipeData);
}
