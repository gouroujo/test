import {
  Controller, Get, Post, Body,
  UseGuards, Req, Session, Render,
  Res, UseFilters, Redirect
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import passport from 'passport'

import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import { kebabCase } from 'lodash'

import type { Request, Response } from 'express'

import { AuthenticatedGuard } from './auth/auth.guard'
import { AuthExceptionFilter } from './auth/auth.filter'

import { AppService } from './app.service'
import { UserService } from './user/user.service'
import { CurrentUser } from './user/user.decorator'
import { User } from './user/user.schema'


@Controller('mfa')
@UseFilters(AuthExceptionFilter)
export class MFAController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('add')
  @Render('mfa-add')
  async add(
    @CurrentUser('username') username: User['username']
  ) {
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(
      username,
      kebabCase(this.configService.get<string>('service')),
      secret,
    )
    return {
      service: this.configService.get('service'),
      title: 'MFA settings',
      qrcode: await qrcode.toDataURL(otpauth, { errorCorrectionLevel: 'L' }),
      secret: secret,
    }
  }

  @UseGuards(AuthenticatedGuard)
  @Post('add')
  @Redirect('add?error=INVALID_MFA')
  async addForm(
    @Body('token') token: string,
    @Body('secret') secret: string,
    @CurrentUser('username') username: User['username']
  ) {
    try {
      const isValid = authenticator.verify({ token, secret })
      if (isValid) {
        await this.userService.setMFA(username, secret)
        return { url: '/' }
      }
    } catch (err) {
      // Possible errors
      // - options validation
      // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
      console.error(err)
    }
  }

  @Get('check')
  check(
    @Session() session: Request['session'],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!session?.credentials || (session.credentials.ts + 60000) < Date.now()) {
      req.flash('error', 'EXPIRED_LOGIN_SESSION')
      return res.redirect('/login')
    }
    return res.render('mfa-check', {
      service: this.configService.get('service'),
      title: 'MFA check',
    })
  }

  @Post('check')
  async checkForm(
    @Body('token') token: string,
    @Session() session: Request['session'],
    @Req() req: Request & any,
    @Res() res: Response,
  ) {
    if (!session?.credentials || (session.credentials.ts + 60000) < Date.now()) {
      req.flash('error', 'EXPIRED_LOGIN_SESSION')
      res.redirect('/login')
    }
    try {
      const isValid = authenticator.verify({
        token,
        secret: session?.credentials?.secret
      })
      if (!isValid) {
        req.flash('error', 'INVALID_MFA')
        return res.redirect('check')
      }
      req.body = session.credentials // FIXME: do not store credential in session
      passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res)
    } catch (err) {
      console.error(err)
      return res.redirect('/login')
    }
  } 

}
