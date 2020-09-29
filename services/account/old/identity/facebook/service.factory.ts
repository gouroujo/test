import { Injectable, Inject } from "@nestjs/common"

import { IFactory } from "src/interface/factory"
import IdentityService from "./service"

import type { IIdentityService } from "../identity.interface"

@Injectable()
export default class IdentityServiceFactory implements IFactory<IIdentityService> {
  constructor(
    @Inject('USER_IDENTITY_SERVICE') private readonly userIdentityService : any
  ) {}

  public makeSvc(): IIdentityService {
    return new IdentityService(this.userIdentityService)
  }

}