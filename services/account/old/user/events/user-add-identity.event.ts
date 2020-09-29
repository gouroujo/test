import { IUser } from "../user.interface"

export class UserAddIdentityEvent {
  constructor(
    public readonly user: IUser,
    public readonly identityInput: any
  ) {}
}