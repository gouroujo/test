
import { Injectable } from '@nestjs/common'
import { find } from 'lodash'
import { UserService } from '../user/user.service'
import { IdentityService } from 'src/identity/identity.service'
import { User } from 'src/user/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly identityService: IdentityService,
  ) {}

  async validateLocalUser(username: string, password: string): Promise<Omit<User, 'identities'>> {
    const user = await this.usersService.findByUsername(username)
    const credentials = find(user?.identities, ['type', 'local'])?.credentials
    const isAuthenticated = await this.identityService.checkLocalIdentityCredentials(
      { username, password },
      { username: credentials?.username, password: credentials?.password, salt: credentials?.salt}
    )
    if (isAuthenticated) {
      const { identities, ...result } = user;
      return result;
    }
    return null;
  }
}