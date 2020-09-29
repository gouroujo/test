
import type { IUserRepository } from "../0-Domain/User/IUserRepository"

import { US0002_UserCreation } from "./US0002-UserCreation"

export type US0001_DefaultUserCreationInput = {
  username: string
}
export class US0001_DefaultUserCreation {
  constructor(
    private readonly userRepository : IUserRepository,
    private readonly userCreation : US0002_UserCreation,
  ) {}

  async exec(input: US0001_DefaultUserCreationInput) {
    if (await this.userRepository.countAll() === 0) {
      await this.userCreation.exec(input)
    }

  }
}