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
    type: Number,
    required: true,
    default: 1,
    index: {
      name: 'active',
      global: true,
    },
    rangeKey: true
  }
}, {
  timestamps: true
})