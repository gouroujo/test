import { Module } from '@nestjs/common'
import { ClientService } from './client.service'
import { DynamooseModule } from 'nestjs-dynamoose'
import { ConfigModule } from '@nestjs/config'

import clientConfig from './client.config'
import { ClientSchema } from './client.schema'
import { ClientController } from './client.controller';

@Module({
  imports: [
    DynamooseModule.forFeature([{ name: 'client', schema: ClientSchema }]),
    ConfigModule.forRoot({
      load: [clientConfig],
    }),
  ],
  providers: [
    ClientService,
  ],
  exports: [
    ClientService,
  ],
  controllers: [ClientController]
})
export class ClientModule {}
