import { IRepository } from "src/interface/repository"
import { IUserRepository, IUser } from "../user.interface"


export default class UserRepository extends IRepository<IUser> implements IUserRepository {
  create(userInput: any): Promise<IUser> {
    throw new Error("Method not implemented.")
  }
  read(username: string): Promise<IUser> {
    throw new Error("Method not implemented.")
  }
  update(username: string, userInput: any): Promise<IUser> {
    throw new Error("Method not implemented.")
  }
  delete(username: string): Promise<null> {
    throw new Error("Method not implemented.")
  }

}