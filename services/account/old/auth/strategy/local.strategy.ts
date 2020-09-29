
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'

import type { Request } from 'express'
import type { IUser, IUserService } from 'src/user/user.interface'


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: IUserService,
  ) {
    super({
      passReqToCallback: true,
    })
  }

  async validate(req: Request, username: string, password: string): Promise<any[] | IUser> {
    const user = await this.userService.authenticate('local', { username, password })
    if (!user) {
      return [null, false, req.flash('error', 'BAD_CREDENTIALS')]
    }
    return user
  }
}