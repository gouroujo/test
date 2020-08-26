import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DynamooseModule } from 'nestjs-dynamoose'
import { GraphQLModule } from '@nestjs/graphql'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OAuthController } from './oauth.controller'
import { IdentityModule } from './identity/identity.module'
import { MFAController } from './mfa.controller'
import { OAuthService } from './oauth.service'
import { KeyModule } from './key/key.module'
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [
        () => ({
          port: parseInt(process.env.ACCOUNT_APP_PORT ?? process.env.PORT, 10) ?? 3000,
          production: process.env['NODE_ENV'] === 'production',
          service: process.env.SERVICE_NAME ?? 'Service name',
          session: {
            secret: 'aa'
          },
          database: {
            tablePrefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
          }
        })
      ]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: {
        endpoint:
          process.env.IS_NOT_SLS === 'true'
            ? '/graphql'
            : `/${process.env.STAGE}/graphql`,
      },
    }),
    DynamooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        local: process.env.IS_DDB_LOCAL === 'true',
        aws: { region: process.env.REGION },
        model: {
          create: false,
          prefix: config.get<string>('database.tablePrefix', ''),
        },
      }),
      inject: [ ConfigService ],
      imports: [ ConfigModule ]
    }),
    KeyModule,
    AuthModule,
    UserModule,
    IdentityModule,
    ClientModule
  ],
  controllers: [
    AppController,
    OAuthController,
    MFAController,
  ],
  providers: [
    AppService,
    OAuthService,
  ],
})
export class AppModule {}
