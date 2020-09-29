import { promisify } from 'util'
import {
  Controller,
  Get, Post, // HTTP methods
  Body, Query, // Data extract from query
  UseGuards, // Route decorator
  Req, Render, Redirect, // Route handler
  ForbiddenException, // HTTP Exception
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'


import { AuthenticatedGuard } from 'src/auth/auth.guard'

import { IIdentityService } from './identity.interface'
import { CurrentUser } from 'src/utils/user.decorator'
import { CsrfToken } from 'src/utils/csrf.decorator'

import type { Request } from 'express'
import type { IUser, IUserService } from 'src/user/user.interface'

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: IUserService,
    private readonly identityService: IIdentityService
  ){}

  @Get('lost')
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

  @Post('lost')
  @Redirect('/login')
  async lostPasswordForm(
    @Body('username') username: string,
    @Req() req: Request,
    @Query('redirect') redirect?: string,
  ) {
    try {
      const existingUser = await this.userService.findOne(username)
      const identity = await this.userService.resetOrCreateIdentity('local', { username })
      req.flash('info', 'PASSWORD_RESET_CONFIRMATION')
      return {}
    } catch (error) {
      req.flash('error', error.message)
      return { url: `/password-lost${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }

    // const existingUser = await this.userService.findOne(username)
    // if(!existingUser) {
    //   req.flash('error', 'USER_NOT_FOUND')
    //   return { url: `/password-lost${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    // }
    // let identity = await existingUser.findIdentity('local')
    // if (!identity) {
    //   // Create a new local identity for this user with no password
    //   identity = await this.identityService.generateLocalIdentity(existingUser.username)
    // }
    // const resetIdentity = await this.identityService.resetLocalIdentity(identity)
    // await existingUser.addIdentity(resetIdentity)
    // await existingUser.save()
    // console.log(`reset link is http://localhost:3000/identity/reset?username=${existingUser.username}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}#${resetIdentity.reset.token}`)
    // req.flash('info', 'PASSWORD_RESET_CONFIRMATION')
    // return
  }

  @Get('reset')
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

  @Post('reset')
  @Redirect('/')
  async resetPasswordForm(
    @Body('username') username: string,
    @Body('token') token: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Query('redirect') redirect?: string,
  ) {
    try {
      const existingUser = await this.userService.findOne(username)
      const identity = await this.userService.updateIdentity('local', { username, password, token })
      req.flash('info', 'PASSWORD_RESET_CONFIRMATION')
      return redirect ? { url: redirect } : {}
    } catch (error) {
      req.flash('error', error.message)
      return { url: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    }

    // const existingUser = await this.userService.findByUsername(username) as any
    // if(!existingUser) {
    //   req.flash('error', 'USER_NOT_FOUND')
    //   return { url: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    // }
    // const identity = await existingUser.findIdentity('local')
    // if (
    //   !identity ||
    //   identity.reset.token !== token ||
    //   identity.reset.expiration < Date.now()
    // ) {
    //   req.flash('error', 'INVALID_RESET_TOKEN')
    //   return { url: `/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}` }
    // }
    
    // const newIdentity = await this.identityService.updateLocalIdentity(identity, {
    //   username,
    //   password
    // })
    // await existingUser.addIdentity(newIdentity)
    // await existingUser.save()
    // await promisify(req.login).bind(req)(existingUser)
    // return redirect ? { url: redirect } : {}
  }
}