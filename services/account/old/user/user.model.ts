import { AggregateRoot } from '@nestjs/cqrs'
import { UserAddIdentityEvent } from './events/user-add-identity.event'

import { IUser, UserRole } from './user.interface'

export class User extends AggregateRoot implements IUser {
  constructor(
    private readonly input: any
  ) {
    super()
  }

  username: string
  identities: any[]
  profile: any
  pictures: any[]
  disabled: boolean
  mfa?: string
  role?: UserRole
  confirmed?: boolean
  confirmationToken?: string

  addIdentity(identityInput: any) {
    // logic
    this.apply(new UserAddIdentityEvent(this, identityInput))
  }
}