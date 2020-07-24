import { Controller, Get, Query, Post, Body, UseGuards, Req, Res, Redirect, Session } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import type { Request } from 'express'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('authorize')
  @Redirect('https://docs.nestjs.com', 302)
  authorize(
    @Query('response_type') responseType: 'code',
    @Query('client_id') clientId: string,
    @Query('state') state: string,
    @Query('scope') scope: string,
    @Query('redirect_uri') redirectUri: string,
    @Query('code_challenge') codeChallenge: string,
    @Query('code_challenge_method') codeChallengeMethod: 'S256',
    @Req() req: Request & { user?: any },
    @Session() session: any, // req.session
  ): { url: string, statusCode?: number } | void {
    if (!req.user) {
      // save parameters with session
      // redirect to signin
      return
    }
    // redirect back to consummer
    const url = new URL(redirectUri)
    const params = new URLSearchParams([
      ['code', 'abc'],
      ['state', state],
      ['error', ''],
      ['error_description', '']
    ])
    return {
      url: redirectUri
    }
  }

  @Get('signin')
  signin() {
    // render signin page
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  login(
    @Req() req: Request
    ): any {
    return
  }

  @Post('oauth/token')
  tokenEndpoint(
    @Body('grant_type') grantType: 'authorization_code',
    @Body('code') code: string,
    @Body('client_id') clientId: string,
    @Body('redirect_uri') redirectUri: string,
    @Body('code_verifier') codeVerifier: string,
  ): {
    access_token: string
  } {
    return {
      access_token: 'a'
    }
  }
}
