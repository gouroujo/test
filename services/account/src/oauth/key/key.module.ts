import { Module } from '@nestjs/common'
import { DynamooseModule } from 'nestjs-dynamoose'
import { ConfigModule } from '@nestjs/config'

import { KeyService } from './key.service'
import { KeySchema } from './key.schema'
import { KeyResolver } from './key.resolver'
import keyConfig from './key.config'

@Module({
  imports: [
    DynamooseModule.forFeature([{ name: 'key', schema: KeySchema }]),
    ConfigModule.forRoot({
      load: [keyConfig],
    }),
  ],
  providers: [
    KeyService,
    KeyResolver,
  ],
  exports: [
    KeyService
  ],
})
export class KeyModule {}
