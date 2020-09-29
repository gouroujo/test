import { IUserIdentityService } from "../user.interface"

export default class UserIdentityService implements IUserIdentityService<any> {
  create(identityInput: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

}