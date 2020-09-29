import { Module } from '@nestjs/common'

import { UserController } from './user.controller'

import type { IFactory } from 'src/interface/factory'
import type { IUserService, IUserRepository } from './user.interface'

@Module({
  controllers: [ UserController ],
  providers: [
    { provide: 'USER_REPOSITORY_FACTORY', useClass: require('./implementation/repository.factory').default },
    { provide: 'USER_REPOSITORY', useFactory: (factory: IFactory<IUserRepository>) => factory.makeSvc(), inject: ['USER_REPOSITORY_FACTORY'] },
    
    { provide: 'USER_SERVICE_FACTORY', useClass: require('./implementation/service.factory').default },
    { provide: 'USER_SERVICE', useFactory: (factory: IFactory<IUserService>) => factory.makeSvc(), inject: ['USER_SERVICE_FACTORY'] },

    { provide: 'USER_IDENTITY_SERVICE_FACTORY', useClass: require('./implementation/identity-service.factory').default },
    { provide: 'USER_IDENTITY_SERVICE', useFactory: (factory: IFactory<IUserService>) => factory.makeSvc(), inject: ['USER_IDENTITY_SERVICE_FACTORY'] },
  ],
  exports: [
    'USER_SERVICE'
  ]
})
export class UserModule {}