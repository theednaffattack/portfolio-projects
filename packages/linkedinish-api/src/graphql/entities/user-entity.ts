import { GraphQLID, GraphQLString } from "graphql";
import { GraphQLTimestamp } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";
import { UserPermissionsEnum, UserRolesEnum } from "../../types/all";

@ObjectType({ description: "User" })
export class UserEntity {
  @Field(() => GraphQLID, { description: "User identifier" })
  id!: string;

  @Field(() => GraphQLString, { description: "User username" })
  username!: string;

  @Field(() => [UserRolesEnum], { description: "User roles" })
  roles!: UserRolesEnum[];

  @Field(() => [UserPermissionsEnum], { description: "User permissions" })
  permissions!: UserPermissionsEnum[];

  @Field(() => GraphQLTimestamp, { description: "Creation timestamp" })
  createdAt!: Date;

  @Field(() => GraphQLTimestamp, { description: "Update timestamp" })
  updatedAt!: Date;
}
