import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { SessionSerializer } from './serializer'

import { LocalStrategy } from './strategy/local.strategy'

import { UserModule } from 'src/user/user.module'
import { IdentityModule } from 'src/identity/identity.module'

@Module({
  imports: [
    UserModule,
    IdentityModule,
    PassportModule.register({ session: true })
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
  ],
})
export class AuthModule {}
