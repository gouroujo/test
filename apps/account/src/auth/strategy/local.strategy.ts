
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

import type { Request } from 'express'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      passReqToCallback: true,
    })
  }

  async validate(req: Request, username: string, password: string): Promise<any> {
    const user = await this.authService.validateLocalUser(username, password)
    if (!user) {
      return [null, false, req.flash('error', 'BAD_CREDENTIALS')]
    }
    return user
  }
}