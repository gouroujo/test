import {
  randomBytes,
  pbkdf2,
  timingSafeEqual,
} from 'crypto'
import { promisify } from 'util'
import { Injectable } from '@nestjs/common'

import { LocalUserIdentity } from './identity.model'

@Injectable()
export class IdentityService {

  async createLocalIdentity(credentials: { username: string, password: string }): Promise<LocalUserIdentity> {
    const salt = await this.generateSalt()
    const password = await this.hashPassword(credentials.password, salt)
    return {
      type: 'local',
      credentials: {
        username: credentials.username,
        password: password.toString('base64'),
        salt: salt.toString('base64'),
      },
      createdAt: new Date(),
    }
  }

  async checkLocalIdentityCredentials(
    candidate: Omit<LocalUserIdentity['credentials'], 'salt'>,
    current: LocalUserIdentity['credentials'],
  ): Promise<Boolean> {
    return (
      candidate.username === current.username
    ) && timingSafeEqual(
      await this.hashPassword(candidate.password, Buffer.from(current.salt, 'base64')),
      Buffer.from(current.password, 'base64')
    )
  }

  private generateSalt(): Promise<Buffer> {
    return promisify(randomBytes)(128)
  }

  private hashPassword(password: string, salt: Buffer): Promise<Buffer> {
    return promisify(pbkdf2)(password, salt, 100000, 64, 'sha512')
  }
}
