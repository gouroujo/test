export interface IIdentity {

}

export interface IIdentityRepository {
  create(username: string, createIdentityInput: any): Promise<IIdentity>
  read(username: string, identityIdentifier: string): Promise<IIdentity>
  update(username: string, identityIdentifier: string, updateIdentityInput: any): Promise<IIdentity>
  delete(username: string, identityIdentifier: string): Promise<void>
}

export interface IIdentityService {
  // business rules
  validate(identityIdentifier: string, credentials: IdentityCredentials): Promise<IIdentity>
  reset(identityIdentifier: string, credentials: Pick<IdentityCredentials, 'username'>): Promise<string>
}

export type IdentityCredentials = {
  username: string
  password?: string
}