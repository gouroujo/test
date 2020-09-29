
// import { Injectable, Inject } from '@nestjs/common'
// import { find } from 'lodash'
// import { IIdentityService } from 'src/identity/identity.interface'
// import { User } from 'src/user/user.schema'

// @Injectable()
// export class AuthService {
//   constructor(
//     @Inject('IDENTITY_SERVICE')
//     private readonly identityService: IIdentityService,
//   ) {}

//   async validateLocalUser(username: string, password: string): Promise<Omit<User, 'identities'>> {
//     const user = await this.usersService.findByUsername(username)
//     const credentials = find(user?.identities, ['type', 'local'])?.credentials
//     const isAuthenticated = await this.identityService.checkLocalIdentityCredentials(
//       { username, password },
//       { username: credentials?.username, password: credentials?.password, salt: credentials?.salt}
//     )
//     if (isAuthenticated) {
//       const { identities, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   async validateByProvider(provider: string, username: string): Promise<any> {
    
//   }

//   async validateLocally(username: string, password: string) {
//     this.identityService.validate('local', )
//   }
// }