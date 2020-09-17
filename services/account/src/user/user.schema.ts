import { Schema } from 'dynamoose'
import type { Document } from 'dynamoose/dist/Document'

import {
  UserIdentitySchema,
  UserIdentity,
  LocalUserIdentity
} from '../identity/identity.model'

export type UserDefaultFields =
  'identities' | 'profile' | 'pictures'

export type UserDocument = Document & User & {
  findIdentity: (type: 'local') => Promise<LocalUserIdentity>
  addIdentity: (identity: UserIdentity) => Promise<UserDocument>
  hasGrantedAuthorization: (clientId: string, scope: string) => Promise<boolean>
}

export interface User {
  username: string
  identities: any[]
  profile: any
  pictures: any[]
  disabled: boolean
  mfa?: string
  role?: string
  confirmed?: boolean
  confirmationToken?: string
}

export const UserSchema = new Schema({
  username: {
    hashKey: true,
    type: String,
    required: true,
  },
  identities: {
    type: Array,
    default: [],
    required: true,
    schema: [{
      type: Object,
      schema: {
        ...UserIdentitySchema.schemaObject as any
      }
    }],
  },
  role: String,
  mfa: String,
  profile: {
    type: Object,
    default: {},
    schema: {
      firstname: String,
      lastname: String,
      birthdate: Date,
      about: String,
      gender: {
        type: String,
        enum: ["male", "female", "other"]
      }
    }
  },
  privateProfile: {
    type: Object,
    default: {},
    schema:{
      phoneNumber: String,
      postalAdress: String,
      city: String,
      zipCode: String,
      country: String
    }
  },
  pictures: {
    type: Array,
    schema: {
      url: String,
      caption: String,
    },
    default: []
  },
  confirmed: Boolean,
  confirmationToken: String,
  disabled: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})