// import { Field, ObjectType } from '@nestjs/graphql'
// import type { SchemaDefinition } from 'dynamoose'

// // Interfaces
// export interface UserIdentity {
//   type: string
//   v?: number
//   createdAt?: Date
//   updatedAt?: Date
// }
// export interface LocalUserIdentity extends UserIdentity {
//   type: 'local'
//   credentials: {
//     username: string
//     password?: string
//     salt: string
//   }
//   reset?: {
//     token: string
//     expiration: number
//   }
// }

// // Dynamoose models
// export const UserIdentitySchema: SchemaDefinition = {
//   type: {
//     type: String,
//     required: true,
//     enum: ['local']
//   },
//   credentials: {
//     type: Object,
//     required: false,
//     schema: {
//       username: {
//         type: String,
//         required: true,
//       },
//       password: {
//         type: String,
//         required: false,
//       },
//       salt: {
//         type: String,
//         required: true,
//       },
//     },
//   },
//   reset: {
//     type: Object,
//     required: false,
//     schema: {
//       token: {
//         type: String,
//         required: true,
//       },
//       expiration: {
//         type: Number,
//         required: true,
//       },
//     },
//   },
//   v: Number,
//   createdAt: Date,
//   updatedAt: Date,
// }

// // Graphql Models
// @ObjectType()
// export class UserIdentityModel implements UserIdentity {
//   @Field(/* istanbul ignore next */ () => String)
//   type: string

//   @Field()
//   createdAt: Date
//   @Field()
//   updatedAt: Date
// }