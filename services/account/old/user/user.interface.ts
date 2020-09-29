import { IdentityCredentials } from "src/identity/identity.interface";

// Core Domain Layer
export interface IUser {
  username: string
  identities: any[]
  profile: any
  pictures: any[]
  disabled: boolean
  mfa?: string
  role?: UserRole
  confirmed?: boolean
  confirmationToken?: string
}

export type UserRole = 'admin' | 'manager' | 'user' | null

// 
export interface IUserRepository {
  // Data storage methods
  create(userInput: any) : Promise<IUser>
  read(user: string | IUser) : Promise<IUser | null>
  update(user: string | IUser, userInput: any): Promise<IUser>
  delete(user: string | IUser): Promise<null>
}

// Core Application layer
export interface IUserService {
  // Business methods
  findOne(user: string | Partial<IUser>): Promise<IUser>

  authenticate(identityIdentifier: string, credentials: IdentityCredentials): Promise<IUser>
  resetOrCreateIdentity(identityIdentifier: string, credentials: IdentityCredentials): Promise<IUser>
  updateIdentity(identityIdentifier: string, credentials: IdentityCredentials & { token: string }): Promise<IUser>

  create(userInput: any ): Promise<IUser>

  serialize(user: IUser): string | Promise<string>
  deserialize(user: string | IUser): IUser | Promise<IUser>
  setMFA(user: string | IUser, secret: string): Promise<IUser>
  hasRole(user: string | IUser, ...roles: UserRole[]): Promise<boolean>
  confirmEmail(user: string | IUser, token: string): Promise<IUser>
}

export interface IUserIdentityService<Identity> {
  // Business methods
  create(identityInput: any) : Promise<Identity>
}