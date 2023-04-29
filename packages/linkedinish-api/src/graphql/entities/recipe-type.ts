import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class RecipeType {
  @Field((type) => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field((type) => [Int])
  ratings!: number[];

  @Field({ nullable: true })
  averageRating?: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
