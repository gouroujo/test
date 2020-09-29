import { IIdentityService, IIdentity } from "../identity.interface";

export interface ILocalIdentity extends IIdentity {

}

export interface ILocalIdentityService extends IIdentityService {
  check(identityIdentifier: string, credentials: any): Promise<boolean>
  reset(identityIdentifier: string): Promise<string>
  generate(identityIdentifier: string) : Promise<ILocalIdentity>
}