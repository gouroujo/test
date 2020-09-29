import type { User } from "src/0-Domain/User/User"
import type { IUserRepository } from "../0-Domain/User/IUserRepository"

export type US0003_UserDeserializationInput = {
  username: User['username']
}
export class US0003_UserDeserialization {
  constructor(
    private readonly userRepository : IUserRepository
  ) {}

  async exec(input: US0003_UserDeserializationInput) {
    return this.userRepository.deserialize(input.username)
  }
}