import {
  Controller, Get, Post, Body, UseGuards,
  Req, Session, Render, Res,
  UseFilters, Redirect, Query, ForbiddenException, Inject
} from '@nestjs/common'


import { AuthenticatedGuard } from 'src/auth/auth.guard'
import { AuthExceptionFilter } from 'src/auth/auth.filter'
import { CurrentUser } from 'src/utils/user.decorator'
import { CsrfToken } from 'src/utils/csrf.decorator'

import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import type { IUser, IUserService } from 'src/user/user.interface'

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userService: Pick<IUserService, 'hasRole'>,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  profile(
    @CurrentUser() user: IUser,
    @Res() res: Response
  ): any {
    const isAllowedToAdmin = this.userService.hasRole(user, 'admin')
    const isAllowedToManageClients = this.userService.hasRole(user, 'admin', 'manager')
    if (!isAllowedToAdmin && !isAllowedToManageClients) {
      return res.redirect('profile')
    }
    res.render('index', {
      isAllowedToAdmin,
      isAllowedToManageClients,
    })
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

  @Get('logout')
  logout(
    @Req() req: Request & any,
    @Res() res: Response,
  ) {
    req.logout()
    res.redirect('/')
  }
}
