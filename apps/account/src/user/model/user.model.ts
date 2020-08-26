import { Field, ID, ObjectType } from '@nestjs/graphql'
import type { Document } from 'dynamoose/dist/Document'

import { UserIdentity, LocalUserIdentity } from 'src/identity/identity.model'

export interface UserKey {
  id: string;
}

export type UserDocument = Document & User
export interface User extends UserKey {
  email: string
  identities: any[]
  profile: any
  pictures: any[]
  disabled: boolean
  mfa: string

  // Methods
  findIdentity: (type: 'local') => Promise<LocalUserIdentity>
  addIdentity: (identity: UserIdentity) => Promise<UserDocument>
  hasGrantedAuthorization: (clientId: string, scope: string) => Promise<boolean>
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