import { Module, CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { KeyModule } from './key/key.module'
import { ClientModule } from './client/client.module'

import { OAuthService } from './oauth.service'
import { OAuthController } from './oauth.controller'

import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
    }),
    CacheModule.register(),
    KeyModule,
    ClientModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    OAuthService,
  ],
  controllers: [
    OAuthController,
  ]
})
export class OAuthModule {}
