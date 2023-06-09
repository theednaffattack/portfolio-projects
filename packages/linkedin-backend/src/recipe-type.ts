import { Field, ObjectType, Int, Float } from "type-graphql";

@ObjectType({ description: "Object representing cooking recipe" })
export class Recipe {
  @Field(() => String)
  title: string;

  @Field((type) => String, {
    nullable: true,
    deprecationReason: "Use `description` field instead",
  })
  get specification(): string | undefined {
    return this.description;
  }

  @Field((type) => String, {
    nullable: true,
    description: "The recipe description with preparation info",
  })
  description?: string;

  @Field((type) => [Int])
  ratings: number[];

  @Field(() => Date)
  creationDate: Date;

  @Field((type) => Int)
  ratingsCount: number;

  @Field((type) => Float, { nullable: true })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }
}
