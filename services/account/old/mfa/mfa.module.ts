import { Module } from '@nestjs/common'
import { MFAController } from './mfa.controller'

@Module({
  controllers: [ MFAController ],
  providers: [],
})
export class MFAModule {};