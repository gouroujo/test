import { Field, ObjectType } from '@nestjs/graphql'
import { Schema } from 'dynamoose'

// Interfaces
export interface UserIdentity {
  type: string
  createdAt?: Date
  updatedAt?: Date
}
export interface LocalUserIdentity extends UserIdentity {
  type: 'local'
  credentials: {
    username: string
    password: string
    salt: string
  }
}

// Dynamoose models
export const UserIdentitySchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['local']
  },
  credentials: {
    type: Object,
    required: false,
    schema: {
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      salt: {
        type: String,
        required: true,
      },
    }
  },
  createdAt: Date,
  updatedAt: Date,
})

// Graphql Models
@ObjectType()
export class UserIdentityModel implements UserIdentity {
  @Field(/* istanbul ignore next */ () => String)
  type: string

  @Field()
  createdAt: Date
  @Field()
  updatedAt: Date
}