import { GraphQLID, GraphQLString } from "graphql";
import { GraphQLTimestamp } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";
import { UserPermissionsEnum, UserRoleEnum } from "~/types";

@ObjectType({ description: "User" })
export class UserEntity {
  @Field(() => GraphQLID, { description: "User identifier" })
  id!: string;

  @Field(() => GraphQLString, { description: "User username" })
  username!: string;

  @Field(() => [UserRoleEnum], { description: "User roles" })
  roles!: UserRoleEnum[];

  @Field(() => [UserPermissionsEnum], { description: "User permissions" })
  permissions!: UserPermissionsEnum[];

  @Field(() => GraphQLTimestamp, { description: "Creation timestamp" })
  createdAt!: Date;

  @Field(() => GraphQLTimestamp, { description: "Update timestamp" })
  updatedAt!: Date;
}
