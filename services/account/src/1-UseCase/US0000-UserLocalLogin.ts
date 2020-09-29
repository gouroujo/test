import { randomBytes, pbkdf2 } from "crypto"
import { promisify } from "util"

import type { IUserRepository } from "../0-Domain/User/IUserRepository"

export type US0000_UserLocalLoginInput = {
  username: string
  password: string
}
export class US0000_UserLocalLogin {
  constructor(
    private readonly userRepository : IUserRepository
  ) {}

  async exec(input: US0000_UserLocalLoginInput) {
    const user = this.userRepository.getByUsername(input.username)
    if (!user) {
      throw new Error('BAD_CREDENTIAL')
    }
  }

  private generateSalt(length: number = 128): Promise<Buffer> {
    return promisify(randomBytes)(length)
  }

  private hashPassword(password: string, salt: Buffer, ...args: any[]): Promise<Buffer> {
    return promisify(pbkdf2)(password, salt, args[0] ?? 100000,  args[1] ?? 64,  args[2] ?? 'sha512')
  }
}