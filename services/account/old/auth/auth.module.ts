import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { SessionSerializer } from './serializer'

import { LocalStrategy } from './strategy/local.strategy'
import { FacebookStrategy } from './strategy/facebook.strategy'

import { UserModule } from 'src/user/user.module'

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true })
  ],
  providers: [
    SessionSerializer,
    /* Passeport Strategies */
    LocalStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
