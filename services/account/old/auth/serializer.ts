import { PassportSerializer } from "@nestjs/passport"
import { Injectable, Inject } from "@nestjs/common"

import type { IUser, IUserService } from "src/user/user.interface"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: Pick<IUserService, 'serialize' | 'deserialize'>,
  ) {
    super()
  }
  
  async serializeUser(user: IUser, done: (err: Error | null, user?: string) => void): Promise<void> {
    try {
      done(null, await this.userService.serialize(user))
    } catch (error) {
      done(error)
    }
  }

  async deserializeUser(username: string, done: (err: Error | null, payload?: any) => void): Promise<void> {
    try {
      done(null, await this.userService.deserialize(username))
    } catch (error) {
      done(error)
    }
  }
} 