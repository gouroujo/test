import { IdentityCredentials, IIdentity, IIdentityService } from "../identity.interface"

export default class IdentityService implements IIdentityService {
  constructor (
    private readonly userIdentityService: any,
  ) {}
  validate(identityIdentifier: string, credentials: IdentityCredentials): Promise<IIdentity> {
    throw new Error("Method not implemented.");
  }
  reset(identityIdentifier: string, credentials: Pick<IdentityCredentials, "username">): Promise<string> {
    throw new Error("Method not implemented.");
  }

}