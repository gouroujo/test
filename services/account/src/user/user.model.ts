import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserModel {
  @Field(/* istanbul ignore next */ () => ID)
  id: string;

  @Field(/* istanbul ignore next */ () => String)
  email: string;

  password: string

  @Field()
  createdAt: Date;

}