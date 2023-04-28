import { Recipe } from "./recipe-type";
import { ArgsType, Int, InputType, Field } from "type-graphql";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
