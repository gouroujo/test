import { IdentityCredentials } from "src/identity/identity.interface"
import { IUserService, IUser, UserRole } from "../user.interface"

export default class UserService implements IUserService {
  findOne(user: string | Partial<IUser>): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  authenticate(identityIdentifier: string, credentials: IdentityCredentials): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  resetOrCreateIdentity(identityIdentifier: string, credentials: IdentityCredentials): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  updateIdentity(identityIdentifier: string, credentials: IdentityCredentials & { token: string; }): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  create(userInput: any): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  hasRole(user: string | IUser, ...roles: UserRole[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  confirmEmail(user: string | IUser, token: string): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  validate(identityIdentifier: string, credentials: IdentityCredentials): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  serialize(user: IUser): string | Promise<string> {
    throw new Error("Method not implemented.");
  }
  deserialize(user: string | IUser): IUser | Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  setMFA(user: string | IUser, secret: string): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}