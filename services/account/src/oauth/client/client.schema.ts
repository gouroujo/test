import { Schema } from 'dynamoose'
import type { Document } from 'dynamoose/dist/Document'

export type ClientDefaultFields =
  'disabled' | 'whitelisted'

export type ClientDocument = Document & Client & {
  checkSecret: (secret: string) => boolean
  checkAllowedURI: (uri: string) => boolean
}

export interface Client {
  id: string
  name: string
  description: string
  disabled: boolean
  whitelisted: boolean
  allowedURI: string[]
  secret?: string
  salt?:string
  logo?: string
  image?: string

  createdAt: Date
  updatedAt: Date
  
}

export const ClientSchema = new Schema({
  id: {
    hashKey: true,
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  whitelisted: {
    type: Boolean,
    default: false,
  },
  secret: {
    type: String,
    required: false,
  },
  allowedURI: {
    type: Array,
    required: true,
    schema: [String],
    default: [],
  },
  image: String,
}, {
  timestamps: true
})