import type { User } from "src/0-Domain/User/User"
import type { IUserRepository } from "../0-Domain/User/IUserRepository"

export type US0003_UserSerializationInput = {
  user: User
}
export class US0003_UserSerialization {
  constructor(
    private readonly userRepository : IUserRepository
  ) {}

  async exec(input: US0003_UserSerializationInput) {
    return this.userRepository.serialize(input.user)
  }
}