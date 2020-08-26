import { promisify } from 'util'
import {
  Controller, Get, Post, Body, UseGuards,
  Req, Session, Render, Res,
  UseFilters, Redirect, Query
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
  login(
    @Req() req: Request,
    @Query('username') username?: string,
  ) {
    return {
      service: this.configService.get('service'),
      title: 'Login',
      username,
      errors: req.flash().error ?? null
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
  signup(
    @Query('username') username?: string
  ) {
    return {
      service: this.configService.get('service'),
      title: 'Signup',
      username,
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
      req.flash('error', 'USER_ALREADY_EXIST')
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
  lostPassword(
    @Query('username') username?: string
  ) {
    return {
      service: this.configService.get('service'),
      title: 'Password lost',
      username,
    }
  }

  @Post('password-lost')
  @Redirect('/login')
  async lostPasswordForm(
    @Body('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const existingUser = await this.userService.findByEmail(username)
    if(!existingUser) {
      req.flash('error', 'USER_NOT_FOUND')
      return { url: `/login` }
    }
    let identity = await existingUser.findIdentity('local')
    if (!identity) {
      identity = await this.identityService.generateLocalIdentity(existingUser.email)
    }
    const resetIdentity = await this.identityService.resetLocalIdentity(identity)
    await existingUser.addIdentity(resetIdentity)
    await existingUser.save()
    console.log(`reset link is http://localhost:3000/password-reset?username=${existingUser.email}#${resetIdentity.reset.token}`)
    req.flash('info', 'PASSWORD_RESET_CONFIRMATION')
    return
  }

  @Get('password-reset')
  @Render('password-reset')
  resetPassword(
    @Query('username') username: string,
  ) {
    return {
      service: this.configService.get('service'),
      title: 'Password reset',
      username,
    }
  }

  @Post('password-reset')
  @Redirect('/')
  async resetPasswordForm(
    @Body('username') username: string,
    @Body('token') token: string,
    @Body('password') password: string,
    @Req() req: Request,
  ) {
    const existingUser = await this.userService.findByEmail(username)
    if(!existingUser) {
      req.flash('error', 'USER_NOT_FOUND')
      return { url: `/login` }
    }
    const identity = await existingUser.findIdentity('local')
    if (
      !identity ||
      identity.reset.token !== token ||
      identity.reset.expiration < Date.now()
    ) {
      req.flash('error', 'INVALID_RESET_TOKEN')
      return { url: `/login` }
    }
    
    const newIdentity = await this.identityService.updateLocalIdentity(identity, {
      username,
      password
    })
    await existingUser.addIdentity(newIdentity)
    await existingUser.save()
    await promisify(req.login).bind(req)(existingUser)
    return
  }

}
