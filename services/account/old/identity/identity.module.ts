import { Module } from '@nestjs/common'

import type { IFactory } from 'src/interface/factory'
import type { IIdentityService } from './identity.interface'

@Module({
  providers: [
    { provide: 'IDENTITY_REPOSITORY', useClass: require('./facebook/repository') },
    { provide: 'IDENTITY_SERVICE_FACTORY', useClass: require('./facebook/service.factory') },
    { provide: 'IDENTITY_SERVICE', useFactory: (factory: IFactory<IIdentityService>) => factory.makeSvc(), inject: ['IDENTITY_SERVICE_FACTORY'] }
  ],
})
export class IdentityModule {}
