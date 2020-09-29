// import {
//   randomBytes,
//   pbkdf2,
//   timingSafeEqual,
// } from 'crypto'
// import { promisify } from 'util'
// import { omit } from 'lodash'
// import { Injectable } from '@nestjs/common'

// // import type { LocalUserIdentity } from './identity.model'

// @Injectable()
// export class UserLocalIdentityService {

//   create(credentials: { username: string, password: string }): Promise<LocalUserIdentity> {
//     return this.generate(credentials.username, credentials.password)
//   }

//   update(
//     identity: LocalUserIdentity,
//     credentials: { username: string, password: string }
//   ): Promise<LocalUserIdentity> {
//     return this.generate(credentials.username, credentials.password, identity)
//   }

//   async check(
//     candidate: Omit<LocalUserIdentity['credentials'], 'salt'>,
//     current: LocalUserIdentity['credentials'],
//   ): Promise<Boolean> {
//     return (
//       candidate.username === current.username
//     ) && current.password && timingSafeEqual(
//       await this.hashPassword(candidate.password, Buffer.from(current.salt, 'base64')),
//       Buffer.from(current.password, 'base64')
//     )
//   }

//   async reset (
//     identity: LocalUserIdentity,
//   ): Promise<LocalUserIdentity> {
//     return {
//       ...identity,
//       reset: {
//         token: (await promisify(randomBytes)(64)).toString('base64'),
//         expiration: Date.now() + 24*60*60*1000,
//       },
//     }
//   }

//   async generate (
//     username: string,
//     password?: string,
//     copy: Partial<LocalUserIdentity> = {},
//   ): Promise<LocalUserIdentity> {
//     const salt = await this.generateSalt()
//     return {
//       type: 'local',
//       createdAt: new Date(),
//       ...omit(copy, ['reset']),
//       credentials: {
//         username: username,
//         salt: salt.toString('base64'),
//         ...(password ? { password: (await this.hashPassword(password, salt)).toString('base64')} : {})
//       },
//       v: typeof copy.v === 'number' ? copy.v + 1 : 0,
//       updatedAt: new Date(),
//     }
//   }

//   private generateSalt(length: number = 128): Promise<Buffer> {
//     return promisify(randomBytes)(length)
//   }

//   private hashPassword(password: string, salt: Buffer): Promise<Buffer> {
//     return promisify(pbkdf2)(password, salt, 100000, 64, 'sha512')
//   }
// }
