import { promisify } from 'util'
import {
  Controller, Get, Post, Body, UseGuards,
  Req, Session, Render, Res,
  UseFilters, Redirect, Query, ForbiddenException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import passport from 'passport'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from './auth/auth.guard'
import { AuthExceptionFilter } from './auth/auth.filter'

import { UserService } from './user/user.service'
import { IdentityService } from './identity/identity.service'
import { CurrentUser } from './user/user.decorator'
import { UserDocument, User } from './user/user.schema'
import { CsrfToken } from './utils/csrf.decorator'

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
    @CurrentUser() user: User,
    @Res() res: Response
  ): any {
    const isAllowedToAdmin = ['admin'].includes(user.role)
    const isAllowedToManageClients = ['admin', 'manager'].includes(user.role)
    if (!isAllowedToAdmin && !isAllowedToManageClients) {
      return res.redirect('profile')
    }
    res.render('index', {
      isAllowedToAdmin,
      isAllowedToManageClients,
    })
  }

  @UseGuards(AuthenticatedGuard)
  @Get('email-confirm')
  @Redirect('/')
  async confirmEmail(
    @CurrentUser() user: UserDocument,
    @Query('username') username: string,
    @Query('confirmation_token') token: string,
    @Req() req: Request,
  ) {
    if (user.username !== username) {
      throw new ForbiddenException({
        error: 'invalid_username',
        error_description: 'provided username does not match the logged user'
      })
    }
    const valid = await this.userService.confirmEmail(user, token)
    if (!valid) {
      throw new ForbiddenException({
        error: 'invalid_confirmation_token',
        error_description: 'confirmation_token is invalid'
      })
    }
    req.flash('success', 'EMAIL_CONFIRMED')
    return
  }

  @Get('login')
  @Render('login')
  login(
    @Req() req: Request,
    @CsrfToken() csrfToken: string,
    @Query('username') username?: string,
    @Query('redirect') redirect?: string,
  ) {
    return {
      csrfToken,
      redirect: redirect && encodeURIComponent(redirect),
      layout: 'login-layout',
      service: this.configService.get('service'),
      title: 'Login',
      username,
      errors: req.flash().error ?? null
    }
  }

  @Post('login')
  async loginForm(
    @Body('username') username: string,
    @Body('password') password: string,
    @Req() req: Request & any,
    @Res() res: Response,
    @Session() session: Request['session'],
    @Query('redirect') redirect?: string,
  ): Promise<void> {
    const existingUser = await this.userService.findByUsername(username)
    if (!!existingUser?.mfa) {
      session.credentials = { // FIXME
        username,
        password,
        secret: existingUser.mfa,
        ts: Date.now()
      }
      res.redirect(`/mfa/check${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`)
    } else {
      passport.authenticate('local',{
        successRedirect: redirect ?? '/',
        failureRedirect: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
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
    @CsrfToken() csrfToken: string,
    @Req() req: Request & any,
    @Query('username') username?: string,
    @Query('redirect') redirect?: string,
  ) {
    return {
      csrfToken,
      redirect: redirect && encodeURIComponent(redirect),
      layout: 'login-layout',
      service: this.configService.get('service'),
      errors: req.flash().error ?? null,
      title: 'Signup',
      username,
    }
  }

  @Post('signup')
  @Redirect('/')
  async signupForm(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Req() req : any,
    @Query('redirect') redirect?: string,
  ): Promise<{ url?: string, statusCode?: string }> {
    // 1 - Find if user (email) already exist
    const existingUser = await this.userService.findByUsername(username)
    if (existingUser) {
      // TODO : link new identity after succefull login
      req.flash('error', 'USER_ALREADY_EXIST')
      return {
        url: `/login?username=${username}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`
      }
    }
    // 2b - If not exist, create new identity object local-identity
    const identity = await this.identityService.createLocalIdentity({ username, password })
    // 3 - Create user
    const user = await this.userService.create({
      username,
      identities: [identity],
      profile: { firstname, lastname }
    })
    // 4 - Make login
    await promisify(req.login).bind(req)(user)

    // 5 - redirect to setup MFA if enabled
    if (true) {
      return { url: `/mfa/add${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }
    return redirect ? { url: redirect } : {}
  }

  @Get('password-lost')
  @Render('password-lost')
  lostPassword(
    @CsrfToken() csrfToken: string,
    @Req() req: Request & any,
    @Query('username') username?: string,
    @Query('redirect') redirect?: string,
  ) {
    return {
      csrfToken,
      redirect: redirect && encodeURIComponent(redirect),
      layout: 'login-layout',
      service: this.configService.get('service'),
      errors: req.flash().error ?? null,
      title: 'Password lost',
      username,
    }
  }

  @Post('password-lost')
  @Redirect('/login')
  async lostPasswordForm(
    @Body('username') username: string,
    @Req() req: Request,
    @Query('redirect') redirect?: string,
  ) {
    const existingUser = await this.userService.findByUsername(username)
    if(!existingUser) {
      req.flash('error', 'USER_NOT_FOUND')
      return { url: `/password-lost${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }
    let identity = await existingUser.findIdentity('local')
    if (!identity) {
      // Create a new local identity for this user with no password
      identity = await this.identityService.generateLocalIdentity(existingUser.username)
    }
    const resetIdentity = await this.identityService.resetLocalIdentity(identity)
    await existingUser.addIdentity(resetIdentity)
    await existingUser.save()
    console.log(`reset link is http://localhost:3000/password-reset?username=${existingUser.username}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}#${resetIdentity.reset.token}`)
    req.flash('info', 'PASSWORD_RESET_CONFIRMATION')
    return
  }

  @Get('password-reset')
  @Render('password-reset')
  resetPassword(
    @CsrfToken() csrfToken: string,
    @Req() req: Request,
    @Query('username') username: string,
    @Query('redirect') redirect?: string,
  ) {
    return {
      csrfToken,
      redirect: redirect && encodeURIComponent(redirect),
      layout: 'login-layout',
      service: this.configService.get('service'),
      errors: req.flash().error ?? null,
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
    @Query('redirect') redirect?: string,
  ) {
    const existingUser = await this.userService.findByUsername(username) as any
    if(!existingUser) {
      req.flash('error', 'USER_NOT_FOUND')
      return { url: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }
    const identity = await existingUser.findIdentity('local')
    if (
      !identity ||
      identity.reset.token !== token ||
      identity.reset.expiration < Date.now()
    ) {
      req.flash('error', 'INVALID_RESET_TOKEN')
      return { url: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }
    
    const newIdentity = await this.identityService.updateLocalIdentity(identity, {
      username,
      password
    })
    await existingUser.addIdentity(newIdentity)
    await existingUser.save()
    await promisify(req.login).bind(req)(existingUser)
    return redirect ? { url: redirect } : {}
  }

}
