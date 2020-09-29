import { Module } from '@nestjs/common'
import { DynamooseModule } from 'nestjs-dynamoose'

import { UserService } from './user.service'
import { UserSchema } from './user.schema'
import { UserResolver } from './user.resolver'
import { UserProfileController } from './user-profile.controller'

@Module({
  imports: [
    DynamooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  providers: [
    UserService,
    UserResolver,
  ],
  controllers: [
    UserProfileController,
  ],
  exports: [
    UserService
  ],
})
export class UserModule {}
