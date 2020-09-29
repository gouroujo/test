import { IRepository } from "src/interface/repository"
import { IIdentityRepository, IIdentity } from "../identity.interface"


export default class UserRepository extends IRepository<IIdentity> implements IIdentityRepository {
  create(userInput: any): Promise<IIdentity> {
    throw new Error("Method not implemented.")
  }
  read(username: string): Promise<IIdentity> {
    throw new Error("Method not implemented.")
  }
  update(username: string, userInput: any): Promise<IIdentity> {
    throw new Error("Method not implemented.")
  }
  delete(username: string): Promise<null> {
    throw new Error("Method not implemented.")
  }

}