import { Schema } from 'dynamoose'
import { UserIdentitySchema } from '../identity/identity.model'

export const UserSchema = new Schema({
  id: {
    hashKey: true,
    type: String,
  },
  email: {
    type: String,
    index: {
      name: "emailIndex",
      global: true
    } // creates a global secondary index with the name `emailIndex` and hashKey `email`
  },
  identities: {
    type: Array,
    schema: [{
      type: Object,
      schema: {
        ...UserIdentitySchema.schemaObject as any
      }
    }],
  },
  mfa: String,
  profile: {
    type: Object,
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
  pictures: {
    type: Array,
    schema: {
      url: String,
      caption: String,
    },
    default: []
  },
  disabled: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
})