import { Injectable } from "@nestjs/common"

import { IFactory } from "src/interface/factory"
import UserService from "./service"

import type { IUserService } from "../user.interface"

@Injectable()
export default class UserServiceFactory implements IFactory<IUserService> {
  constructor(
    
  ) {

  }
  public makeSvc(): IUserService {
    return new UserService()
  }

}