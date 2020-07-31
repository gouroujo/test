import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import session from 'express-session'
import passport from 'passport'
import flash from 'connect-flash'
import bodyParser from 'body-parser'
import * as dynamoose from 'dynamoose'

import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

export async function generateApp(...params: any) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, ...params
  )
  const config = app.get(ConfigService)

  app.useStaticAssets(join(__dirname, '../..', 'public'))
  app.setBaseViewsDir(join(__dirname, '../..', 'views'))
  
  app.setViewEngine('hbs')
  app.set('view options', { layout: 'layout' });

  const DynamoDBStore = require('connect-dynamodb')(session)
  app.use(
    session({
      store: new DynamoDBStore({
        client: dynamoose.aws.ddb(),
        table: `${config.get<string>('database.tablePrefix', '')}Session`,
      }),
      secret: config.get<string>('session.secret'),
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())

  return app
}

async function bootstrap() {
  const app = await generateApp()
  await app.listen(3000)
}

bootstrap()
