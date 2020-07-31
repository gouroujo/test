import { Schema } from 'dynamoose'
import type { ModelOptionsOptional } from 'dynamoose/dist/Model'

export const SessionSchema = new Schema({
  id: {
    hashKey: true,
    type: String,
  },
  ttl: Number,
}, {
  timestamps: false
})

export const options: ModelOptionsOptional = {
  expires: 30*24*60*60*1000
}