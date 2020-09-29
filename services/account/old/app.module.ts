import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DynamooseModule } from 'nestjs-dynamoose'
import { GraphQLModule } from '@nestjs/graphql'

// CSRF protection middleware
import csurf from 'csurf'

import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { OAuthModule } from './oauth/oauth.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
// import { MFAController } from './mfa.controller'

const isProduction = process.env.NODE_ENV === 'production'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      ignoreEnvFile: isProduction,
      load: [
        () => ({
          port: parseInt(process.env.ACCOUNT_APP_PORT ?? process.env.PORT, 10) ?? 3000,
          production: isProduction,
          livereload: !isProduction,
          service: process.env.SERVICE_NAME ?? 'Service name',
          session: {
            secret: 'aa'
          },
          database: {
            tablePrefix: `${process.env.SERVICE}-${process.env.STAGE}-`,
          },
          isServerless: !process.env.IS_NOT_SLS
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
    AuthModule,
    UserModule,
    OAuthModule
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(csurf())
      .exclude(
        { path: 'oauth/token', method: RequestMethod.POST },
      )
      .forRoutes('*')
  }
}
