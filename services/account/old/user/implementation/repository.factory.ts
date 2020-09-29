import { ModuleRef } from "@nestjs/core"
import { Injectable } from "@nestjs/common"

import { IFactory } from "src/interface/factory"
import UserRepository from "./repository"

import type { IUserRepository } from "../user.interface"

@Injectable()
export default class UserRepositoryFactory implements IFactory<IUserRepository> {
  private connection: any

  constructor(
    private moduleRef: ModuleRef
  ) {
    // this.connection = this.moduleRef.get('CONNECTION', { strict: false })
  }
  
  public makeSvc(): IUserRepository {
    return new UserRepository()
  }

}