import { Field, ID, ObjectType } from '@nestjs/graphql'

export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  email: string
  identities: any[]
  profile: any
  pictures: any[]
  disabled: boolean
  mfa: string
}

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