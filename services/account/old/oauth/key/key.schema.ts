import { Schema } from 'dynamoose'

export const KeySchema = new Schema({
  id: {
    hashKey: true,
    type: String,
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  }
}, {
  timestamps: true
})

