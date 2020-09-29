import { Injectable } from "@nestjs/common"

import { IFactory } from "src/interface/factory"
import UserIdentityService from "./identity-service"

import type { IUserIdentityService } from "../user.interface"

@Injectable()
export default class UserIdentityServiceFactory implements IFactory<IUserIdentityService<any>> {
  constructor(
    
  ) {

  }
  public makeSvc(): IUserIdentityService<any> {
    return new UserIdentityService()
  }

}