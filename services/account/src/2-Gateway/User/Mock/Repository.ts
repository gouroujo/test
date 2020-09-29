import { find } from "lodash"

import type { IUserRepository } from "src/0-Domain/User/IUserRepository"
import type { User } from "src/0-Domain/User/User"


export class UserRepository implements IUserRepository {
  constructor(
    private readonly state: any = []
  ) {

  }
  create(input: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  countAll(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getByUsername(username: string): Promise<User> {
    return find(this.state,  ['username', username ])
  }
  
  updateByUsername(username: string, updatedFields: Pick<Partial<User>, "createdAt">): Promise<User> {
    throw new Error("Method not implemented.");
  }
  
}