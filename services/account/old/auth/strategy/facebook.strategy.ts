
import { Strategy } from 'passport-facebook'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'

import type { Request } from 'express'
import type { IUserService } from 'src/user/user.interface'

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: IUserService,
  ) {
    super({
      passReqToCallback: true,
      clientID    : 'anid', 
      clientSecret: 'secret',
      profileFields: ['id', 'first_name', 'last_name', 'picture', 'email', 'permissions'],
    })
  }

  async validate(req: Request, _accessToken: string, _refreshToken: string, profile: any): Promise<any> {
    const user = await this.userService.authenticate('facebook', { username: profile.email })
    console.log(profile) // FIXME
    /* 
      2 possible errors :
       A - User {username} exists but there is no identity for facebook
       B - User {username} does not exist and we should create it : TODO
    */
    if (!user) {
      return [null, false, req.flash('error', 'BAD_CREDENTIALS')]
    }
    return user
  }
}