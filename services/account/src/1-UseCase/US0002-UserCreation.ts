import { randomBytes, pbkdf2 } from "crypto"
import { promisify } from "util"

import type { IUserRepository } from "../0-Domain/User/IUserRepository"

export type US0002_UserCreationInput = {
  username: string
  password?: string
}
export class US0002_UserCreation {
  constructor(
    private readonly userRepository : IUserRepository
  ) {}

  async exec(input: US0002_UserCreationInput) {
    const user = {}
    
    return this.userRepository.create(input)
  }

  private generateSalt(length: number = 128): Promise<Buffer> {
    return promisify(randomBytes)(length)
  }

  private hashPassword(password: string, salt: Buffer, ...args: any[]): Promise<Buffer> {
    return promisify(pbkdf2)(password, salt, args[0] ?? 100000,  args[1] ?? 64,  args[2] ?? 'sha512')
  }
}