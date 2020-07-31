import { promisify } from 'util'
import {
  Controller, Get, Post, Body, UseGuards,
  Req, Session, Render, Headers, Res,
  UseFilters, Param, Redirect
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import passport from 'passport'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from './auth/auth.guard'
import { AuthExceptionFilter } from './auth/auth.filter'

import { UserService } from './user/user.service'
import { IdentityService } from './identity/identity.service'

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly identityService: IdentityService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  profile(
    @Req() req: Request & { user: any }
  ): any {
    return req.user
  }

  @Get('login')
  @Render('login')
  login() {
    return {
      service: this.configService.get('service'),
      title: 'Login',
    }
  }

  @Post('login')
  async loginForm(
    @Body('username') email: string,
    @Body('password') password: string,
    @Req() req: Request & any,
    @Res() res: Response,
    @Session() session: Request['session'],
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(email)
    if (!!existingUser?.mfa) {
      session.credentials = {
        username: email ,
        password,
        secret: existingUser.mfa,
        ts: Date.now()
      }
      res.redirect('/mfa/check')
    } else {
      passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res)
    }
  }

  @Get('logout')
  logout(
    @Req() req: Request & any,
    @Res() res: Response,
  ) {
    req.logout()
    res.redirect('/')
  }

  @Get('signup')
  @Render('signup')
  signup() {
    return {
      service: this.configService.get('service'),
      title: 'Signup',
    }
  }

  @Post('signup')
  @Redirect('/')
  async signupForm(
    @Body() body: any,
    @Req() req : any,
  ): Promise<{ url?: string, statusCode?: string }> {
    // 1 - Find if user (email) already exist
    const existingUser = await this.userService.findByEmail(body.email)
    if (existingUser) {
      // TODO : link new identity after succefull login
      return {
        url: `/login?username=${body.email}`
      }
    }
    // 2b - If not exist, create new identity object local-identity
    const identity = await this.identityService.createLocalIdentity({
      username: body.email, // use email as username
      password: body.password,
    })
    // 3 - Create user
    const user = await this.userService.create({
      email: body.email,
      identities: [identity],
      profile: {
        firstname: body.firstname,
        lastname: body.lastname,
      }
    })
    // 4 - Make login
    await promisify(req.login).bind(req)(user)

    // 5 - redirect to setup MFA if enabled
    if (true) {
      return { url: '/mfa/add' }
    }
    return
  }

  @Get('password-lost')
  @Render('password-lost')
  lostPassword() {
    return {
      service: this.configService.get('service'),
      title: 'Password lost,'
    }
  }

  @Get('password-reset')
  @Render('password-reset')
  resetPassword() {
    return {
      service: this.configService.get('service'),
      title: 'Password reset',
    }
  }

}
